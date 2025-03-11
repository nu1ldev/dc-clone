import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { db } from '../../web/src/appwrite'
import { Query } from 'appwrite'

const signingSecret = String(process.env.SIGNING_SECRET)

const app = new Elysia()
  .use(cors())
  .get('/', () => 'bambambam')
  .post('/webhooks', async ({ request }) => {
    if (!signingSecret) {
      throw new Error(
        'Error: Please add SIGNING_SECRET from Appwrite Dashboard to .env'
      )
    }
  })
  .post('/get-user', async ({ request }) => {
    const { userId } = await request.json()
    if (!userId) throw new Error('sıçtın zateb mal mısın')

    const user = await db.listDocuments('main', 'users')
    console.log(user)
    return JSON.stringify(user)
  })
  .post('/get-server', async ({ request }) => {
    const { id, userId }: { id: string; userId: string } = await request.json()
    // serverid ile tekli server alma
    if (!userId && id) {
      const server = await db.getDocument('main', 'servers', id)
      console.log(server)
      return JSON.stringify({ server })
    } else if (userId && !id) {
      // userid ile çoklu server
      const userServers = await db.listDocuments('main', 'servers')
      return JSON.stringify(userServers)
    }
    return new Response('id veya serverid gönderilmedi', { status: 400 })
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
    return new Response('channelid ve serverid ikisi de yok', { status: 400 })
  })
  .post('/get-dm', async ({ request }) => {
    const { id, userId } = await request.json()

    if (!id && !userId) return new Response('/get-dm: id yok', { status: 400 })

    // userid ile çoklu dm
    if (!id && userId) {
      const dms = await db.user
        .findUnique({
          where: {
            id: userId
          }
        })
        .directMessages()
      return JSON.stringify(dms)
    }

    // id ile tek dm
    if (!userId && id) {
      const dm = await db.dm.findUnique({
        where: {
          id
        }
      })
      return JSON.stringify(dm)
    }

    return new Response('userid veya dmid yok', { status: 400 })
  })
  .post('/get-friends', async ({ request }) => {
    const { friendId, userId } = await request.json()
    if (friendId) {
      const user = await db.user.findUnique({
        where: {
          id: friendId
        }
      })
      return JSON.stringify(user)
    } else if (userId) {
      const friends =
        (await db.user
          .findUnique({
            where: {
              id: userId
            }
          })
          .friends()) ?? []
      return JSON.stringify([...friends])
    }
  })
  .listen(9999)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
