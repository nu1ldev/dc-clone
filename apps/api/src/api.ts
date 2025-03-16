import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { createClient } from '@supabase/supabase-js'
import { Database, Tables } from '../../web/src/database.types'

const supabase = createClient<Database>(
  Bun.env.SUPABASE_URL!,
  Bun.env.SUPABASE_ANON_KEY!
)

const app = new Elysia()
  .use(cors())
  .get('/', () => 'bambambam')
  .options('/*', () => new Response('ok', { status: 200 }))
  .post('/get-user', async ({ request }) => {
    const { token } = await request.json()
    if (!token) throw new Error('sıçtın zateb mal mısın')

    const {
      error,
      data: user,
      status
    } = await supabase.from('users').select('*').eq('token', token)

    if (error) return new Response(JSON.stringify(error), { status })
    else if (user) return new Response(JSON.stringify(user), { status: 200 })
    else return new Response('Server sıçtı', { status: 500 })
  })
  .post('/get-server', async ({ request }) => {
    const { id, token } = await request.json()
    if (!token && id) {
      const server = await supabase.from('servers').select('*').eq('id', id)
      return JSON.stringify(server)
    } else if (token && !id) {
      const userServers = await supabase
        .from('_user_servers')
        .select('*')
        .eq('user_token', token)
      return JSON.stringify(userServers)
    }
    return new Response('id veya serverid gönderilmedi', { status: 400 })
  })
  .post('/get-channel', async ({ request }) => {
    const { id, serverId } = await request.json()
    if (id && !serverId) {
      const {
        error,
        data: channel,
        status
      } = await supabase.from('channels').select('*').eq('id', id)
      if (error) return new Response(JSON.stringify(error), { status })
      else if (channel)
        return new Response(JSON.stringify(channel), { status: 200 })
      else return new Response('Server sıçtı', { status: 500 })
    } else if (serverId && !id) {
      const serverChannels = await supabase
        .from('channels')
        .select('*')
        .eq('serverId', serverId)
      return JSON.stringify(serverChannels)
    }
    return new Response('channelid ve serverid ikisi de yok', { status: 400 })
  })
  .post('/get-dm', async ({ request }) => {
    const { id, token } = await request.json()
    if (!id && !token)
      return new Response('id veya user token yok', { status: 500 })
    if (!id && token) {
      const {
        error,
        data: dmIds,
        status
      } = await supabase
        .from('_user_dms')
        .select('dm_id')
        .eq('user_token', token)
      if (error) return new Response(JSON.stringify(error), { status })
      else if (dmIds) {
        const dms: Tables<'dms'>[] = []
        dmIds.map(async dmId => {
          const dm = await supabase.from('dms').select('*').eq('id', dmId.dm_id)
          if (dm.data && !Array.isArray(dm.data)) {
            dms.push(dm.data as Tables<'dms'>)
          }
        })
        return new Response(JSON.stringify(dms), { status: 200 })
      }
    }
    if (!token && id) {
      const dm = await supabase.from('dms').select('*').eq('id', id)
      return JSON.stringify(dm)
    }
    return new Response('token veya dmid yok', { status: 400 })
  })
  .post('/get-friends', async ({ request }) => {
    const { friendToken, token } = await request.json()
    if (friendToken) {
      const friend = await supabase
        .from('users')
        .select('*')
        .eq('token', friendToken)
      return JSON.stringify(friend)
    } else if (token) {
      const friends = (
        await supabase.from('_user_friends').select('*').eq('a', token)
      ).data
      const friendsOf = (
        await supabase.from('_user_friends').select('*').eq('b', token)
      ).data
      return JSON.stringify([...(friends ?? []), ...(friendsOf ?? [])])
    } else return new Response('friendToken veya token yok', { status: 400 })
  })
  .post('/get-messages', async ({ request }) => {
    const { channelId, dmId } = await request.json()
    if (channelId) {
      const messages = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', channelId)
      return JSON.stringify(messages)
    } else if (dmId) {
      const messages = await supabase
        .from('messages')
        .select('*')
        .eq('dmId', dmId)
      return JSON.stringify(messages)
    } else return new Response('channelId veya dmId yok', { status: 400 })
  })
  .listen(9999)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)