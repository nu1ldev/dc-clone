import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db'
import { randomUUID } from 'node:crypto'

export const config = {
  api: {
    bodyParser: true, // Next.js'in body'yi JSON olarak parse ettiğinden emin ol
  },
};

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  let body;
  try {
    const rawBody = await req.text()
    body = JSON.parse(rawBody)
  } catch (error) {
    console.error('trycatch:', error)
  }
  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(JSON.stringify(body), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Handle event
  const eventType = evt.type
  if (eventType === 'user.created') {
    const user = await db.user.create({
      data: {
        email: evt.data.email_addresses[0].email_address,
        username: evt.data.username ?? evt.data.email_addresses[0].email_address.split('@')[0],
        token: randomUUID({ disableEntropyCache: true }),
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
}
