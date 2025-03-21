import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { createClient } from '@supabase/supabase-js'
import { Database, Tables } from '../../web/src/database.types'

const supabase = createClient<Database>(
  Bun.env.SUPABASE_URL!,
  Bun.env.SUPABASE_SERVICE_ROLE_KEY!
)

const app = new Elysia()
  .use(cors())
  .get('/', () => 'bambambam')
  .options('/*', () => new Response('ok', { status: 200 }))
  .post('/get-server', async ({ request }) => {
    const { serverToken, token } = await request.json()
    if (!token && serverToken) {
      const { error, data } = await supabase
        .from('servers')
        .select('*')
        .eq('token', serverToken)
        .limit(1)
        .single()
      if (error) return new Response(JSON.stringify(error), { status: 500 })
      else if (data) {
        const { error: defaultChannelError, data: defaultChannel } =
          await supabase
            .from('channels')
            .select('*')
            .eq('id', data.default_channel_id)
            .limit(1)
            .single()

        if (defaultChannelError)
          return new Response(
            JSON.stringify(
              `defaultChannelError: ${JSON.stringify(defaultChannelError.message)}`
            ),
            { status: 500 }
          )

        const _channels = await supabase
          .from('_server_channels')
          .select('*')
          .eq('server_token', data.token)

        if (_channels.error)
          return new Response(JSON.stringify(_channels.error), {
            status: _channels.status
          })

        const channels: any[] = []

        const promises = _channels.data.map(async _channel => {
          if (!_channel.channel_id) return null
          const { data, error } = await supabase
            .from('channels')
            .select('*')
            .eq('id', _channel.channel_id)
            .limit(1)
            .single()

          if (error) {
            console.error(`Error fetching channel with id ${_channel.channel_id}:`, error)
            return null
          }
          return data
        })

        const values = await Promise.all(promises)
        values.forEach(channel => {
          if (channel) channels.push(channel)
        })

        return { server: data, defaultChannel: defaultChannel, serverChannels: channels }
      } else if (data == null) {
        return new Response('Server bulunamadı', { status: 404 })
      } else return new Response('Server sıçtı', { status: 500 })
    } else if (token && !serverToken) {
      const _userServers = await supabase
        .from('_user_servers')
        .select('*')
        .eq('user_token', token)

      if (_userServers.error)
        return new Response(JSON.stringify(_userServers.error), { status: 500 })

      const servers: any[] = []
      const promises = _userServers.data.map(async _user_server => {
        if (!_user_server.server_id) return null
        const { data, error } = await supabase
          .from('servers')
          .select('*')
          .eq('id', _user_server.server_id)
          .limit(1)
          .single()

        if (error) {
          console.error(
            `Error fetching server with id ${_user_server.server_id}:`,
            error
          )
          return null
        }
        return data
      })

      const values = await Promise.all(promises)
      values.forEach(server => {
        if (server) servers.push(server)
      })

      console.log('servers: ', servers)
      return new Response(JSON.stringify(servers), { status: 200 })
    }
    return new Response(
      'id veya serverid gönderilmedi veya ikisi de gönderildi',
      { status: 400 }
    )
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
      return new Response('hersey sıçtı', { status: 500 })
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
  .post(
    '/add-friend',
    async ({ body }) => {
      const { accepterToken, friendRequest } = body

      if (friendRequest.state !== 'accepted')
        return new Response('kabul etmemiş ki', { status: 400 })

      const { data: sender, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', friendRequest.sender_id)

      if (error) return new Response(JSON.stringify(error), { status: 500 })

      const { data, error: insertError } = await supabase
        .from('_user_friends')
        .insert({
          a: sender[0].token,
          b: accepterToken
        })
      if (insertError)
        return new Response(JSON.stringify(insertError), { status: 500 })
      return new Response(JSON.stringify(data), { status: 200 })
    },
    {
      body: t.Object({
        accepterToken: t.String(),
        friendRequest: t.Object({
          id: t.Number(),
          sender_id: t.Number(),
          sent_to_id: t.Number(),
          state: t.Enum({
            pending: 'pending',
            accepted: 'accepted',
            declined: 'declined'
          })
        })
      })
    }
  )
  .get('/users/:id', async ({ params }) => {
    const { id } = params
    if (!id) return new Response('id yok', { status: 400 })
    const user = await supabase.auth.admin.getUserById(id)
    return JSON.stringify(user.data.user)
  })
  .get('db-users/:id', async ({ params }) => {
    const { id } = params
    if (!id) return new Response('id yok', { status: 400 })
    const authUser = await supabase.auth.admin.getUserById(id)
    if (authUser.error) return 'authUser sıçtı'
    const dbUser = await supabase
      .from('users')
      .select('*')
      .eq('token', authUser.data.user?.id)
    return new Response(JSON.stringify(dbUser), { status: dbUser.status })
  })
  .listen(9999)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

// ;(async () => {
//   const servers = await supabase
//     .from('servers')
//     .insert([
//       {
//         name: 'bayrinin cariyeleri 😜',
//         default_channel_id: 3,
//         rules_channel_id: 6,
//         owner_id: 8
//       }
//     ])
//     console.log(servers)
// })()
