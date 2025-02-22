import { db } from '../../web/src/db'
import { Elysia, t } from 'elysia'
import { clerkPlugin, WebhookEvent } from 'elysia-clerk'
import { randomId } from 'elysia/dist/utils'
import { Webhook } from 'svix'

const app = new Elysia()
  .use(clerkPlugin())
  .get('/', () => 'bambambam')
  .post('/webhooks', async ({ request, body }) => {
    const SIGNING_SECRET = process.env.SIGNING_SECRET

    if (!SIGNING_SECRET) {
      throw new Error(
        'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env'
      )
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET)

    // Get headers and body
    const headers = request.headers
    const payload = body
    console.log('payload: ', JSON.stringify(body))

    // Get Svix headers for verification
    const svix_id = headers.get('svix-id')
    const svix_timestamp = headers.get('svix-timestamp')
    const svix_signature = headers.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return 'Missing svix headers'
    }

    let evt: WebhookEvent

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If verification fails, error out and return error code
    try {
      evt = wh.verify(JSON.stringify(payload), {
        'svix-id': svix_id as string,
        'svix-timestamp': svix_timestamp as string,
        'svix-signature': svix_signature as string
      }) as WebhookEvent
    } catch (err) {
      console.log('Error: Could not verify webhook:', err)
      return `Error: ${err}`
    }

    const eventType = evt.type
    if (eventType === 'user.created') {
      const user = await db.user.create({
        data: {
          email: evt.data.email_addresses[0].email_address,
          username: evt.data.username ?? evt.data.email_addresses[0].email_address.split('@')[0],
          token: randomId(),
          imageUrl: evt.data.image_url,
          clerk_id: evt.data.id,
          createdAt: evt.data.created_at.toString()
        }
      })
      return new Response(JSON.stringify(user), { status: 200 })
    }
    else if (eventType === 'user.deleted') {
      await db.user.delete({
        where: {
          clerk_id: evt.data.id
        }
      })
      return new Response('User deleted', { status: 200 })
    }
    return new Response('Error: Unknown event type', { status: 400 })
  })
  .post('/get-user', async ({ request }) => {
    const { clerk_id } = await request.json()
    if (!clerk_id) throw new Error('sıçtın zateb mal mısın')
    const user = await db.user.findUnique({
      where: {
        clerk_id
      }
    })
    return JSON.stringify(user)
  })
  .post('/get-server', async ({ request }) => {
    const { id, userId } = await request.json()
    if (!userId && id) {
      const server = await db.server.findUnique({
        where: {
          id
        }
      })
      return JSON.stringify(server)
    } else if (userId && !id) {
      const userServers = await db.user
        .findUnique({
          where: {
            clerk_id: userId
          }
        })
        .servers()
      return JSON.stringify(userServers)
    }
  })
  .post('/get-channel', async ({ request }) => {
    const { id, serverId } = await request.json()
    if (id && !serverId) {
      const channel = await db.channel.findUnique({
        where: {
          id
        }
      })
      return JSON.stringify(channel)
    } else if (serverId && !id) {
      const serverChannels = await db.server
        .findUnique({
          where: {
            id: serverId
          }
        })
        .channels()
      return JSON.stringify(serverChannels)
    }
    return new Error('bambambam /get-channels sıçtı')
  })
  .listen(9999)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
