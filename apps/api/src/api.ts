import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { createClient } from '@supabase/supabase-js'
import { Database, Tables } from './database.types'

const supabase = createClient<Database>(
  Bun.env.SUPABASE_URL!,
  Bun.env.SUPABASE_SERVICE_ROLE_KEY!
)

const app = new Elysia()
  .use(cors())
  .get('/', () => 'bambambam')
  .options('/*', () => new Response('ok', { status: 200 }))
  .post(
    '/user-servers',
    async ({ body }) => {
      const { token } = body

      const { data, error } = await supabase
        .from('_user_servers')
        .select('*')
        .eq('user_token', token)

      if (error)
        return new Response(JSON.stringify(error), {
          status: 500
        })

      const servers: any[] = []
      const promises = data.map(async _user_server => {
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

      return new Response(JSON.stringify(servers), { status: 200 })
    },
    {
      body: t.Object({
        token: t.String()
      })
    }
  )
  .post(
    '/server-channels',
    async ({ body }) => {
      const { serverId } = body

      const { data, error, status } = await supabase
        .from('channels')
        .select('*')
        .eq('serverId', serverId)

      if (error)
        return new Response(
          `Error while fetching channel with serverId: ${serverId}`,
          { status }
        )

      return JSON.stringify(data)
    },
    {
      body: t.Object({
        serverId: t.Number()
      })
    }
  )
  .post(
    '/get-dm',
    async ({ body }) => {
      // @ts-ignore
      const { id, token } = JSON.parse(body)

      if (!id && !token)
        return new Response('id veya user token yok', { status: 500 })

      if (!id && token) {
        const { error, data, status } = await supabase
          .from('_user_dms')
          .select('*')
          .eq('user_token', token)

        if (error) return new Response(JSON.stringify(error), { status })
        else if (data) {
          const dms: { dm: Tables<'dms'>; participants: Tables<'users'>[] }[] =
            []

          const dmPromises = data.map(async _userDm => {
            if (!_userDm.dm_id) return null
            const dm = await supabase
              .from('dms')
              .select('*')
              .eq('id', _userDm.dm_id)
              .limit(1)
              .single()

            const allDms = await supabase
              .from('_user_dms')
              .select('*')
              .eq('dm_id', _userDm.dm_id)

            if (allDms.error) return null

            const participants: Tables<'users'>[] = []
            const participantPromises = allDms.data.map(async _userDm => {
              if (!_userDm) return null
              const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', _userDm.user_id)
                .limit(1)
                .single()

              if (error) {
                console.error(
                  `Error fetching user with id ${_userDm.user_id}:`,
                  error
                )
                return null
              }
              return data
            })

            const values = await Promise.all(participantPromises)
            values.forEach(p => {
              if (p) participants.push(p)
            })

            if (dm.error) {
              console.error(
                `Error fetching dm with id ${_userDm.dm_id}:`,
                error
              )
              return null
            }
            return { dm: dm.data, participants }
          })

          const dmValues = await Promise.all(dmPromises)
          dmValues.forEach(dm => {
            if (dm) dms.push(dm)
          })
          return new Response(JSON.stringify(dms), { status: 200 })
        }
        return new Response('hersey sıçtı', { status: 500 })
      }
      if (!token && id) {
        const dm = await supabase
          .from('dms')
          .select('*')
          .eq('id', id)
          .limit(1)
          .single()

        if (dm.error)
          return new Response(JSON.stringify(dm.error), { status: dm.status })

        const _user_dms = await supabase
          .from('_user_dms')
          .select('*')
          .eq('dm_id', id)

        if (_user_dms.error)
          return new Response(JSON.stringify(_user_dms.error), {
            status: _user_dms.status
          })

        const participants: Tables<'users'>[] = []
        const promises = _user_dms.data.map(async ({ user_id }) => {
          if (!user_id) return null
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user_id)
            .limit(1)
            .single()

          if (error) return null
          return data
        })

        const values = await Promise.all(promises)
        values.map(val => {
          if (val) participants.push(val)
        })

        return JSON.stringify({ dm: dm.data, participants })
      }
      return new Response('token veya dmid yok', { status: 400 })
    },
    {
      body: t.ObjectString({
        id: t.Optional(t.Number()),
        token: t.Optional(t.String())
      })
    }
  )
  .post(
    '/user-friends',
    async ({ body }) => {
      // @ts-ignore
      const { token } = JSON.parse(body)
      console.log('token: ', token)
      console.log('body: ', body)

      const friends: Tables<'users'>[] = []
      const friendsOf: Tables<'users'>[] = []

      const _friends = await supabase
        .from('_user_friends')
        .select('*')
        .eq('a', token)

      const _friendsOf = await supabase
        .from('_user_friends')
        .select('*')
        .eq('b', token)

      if (_friends.error)
        return new Response(
          `Error while fetching \"_friends\": ${JSON.stringify(_friends.error)}`,
          { status: _friends.status, statusText: _friends.statusText }
        )
      else if (_friends.data) {
        const promises = _friends.data.map(async _user_friend => {
          if (!_user_friend.b) return null
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('token', _user_friend.b)
            .limit(1)
            .single()

          if (error) {
            console.error(
              `Error fetching user with token ${_user_friend.b}:`,
              error
            )
            return null
          }
          return data
        })

        const values = await Promise.all(promises)
        values.forEach(user => {
          if (user) friends.push(user)
        })
      }

      if (_friendsOf.error)
        return new Response(
          `Error while fetching \"_friendsOf\": ${_friendsOf.error}`,
          { status: _friendsOf.status, statusText: _friendsOf.statusText }
        )
      else if (_friendsOf.data) {
        const promises = _friendsOf.data.map(async _user_friend => {
          if (!_user_friend.a) return null
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('token', _user_friend.a)
            .limit(1)
            .single()

          if (error) {
            console.error(
              `Error fetching user with token ${_user_friend.a}:`,
              error
            )
            return null
          }
          return data
        })

        const values = await Promise.all(promises)
        values.forEach(user => {
          if (user) friendsOf.push(user)
        })
      }
      return JSON.stringify([...(friends ?? []), ...(friendsOf ?? [])])
    },
    {
      body: t.ObjectString({
        token: t.String()
      })
    }
  )
  .post(
    '/get-messages',
    async ({ body }) => {
      // @ts-ignore
      const { channelId, dmId } = JSON.parse(body)

      if (channelId && !dmId) {
        const rawMessages = await supabase
          .from('messages')
          .select('*')
          .eq('channel_id', channelId)

        if (rawMessages.error) {
          return new Response(JSON.stringify(rawMessages.error), {
            status: rawMessages.status
          })
        }

        const messages: {
          message: Tables<'messages'>
          author: Tables<'users'>
        }[] = []

        const authorPromises = rawMessages.data.map(async msg => {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', msg.author_id)
            .limit(1)
            .single()

          if (error) return null
          return { message: msg, author: data }
        })

        const values = await Promise.all(authorPromises)
        values.forEach(msgInstance => {
          if (msgInstance) messages.push(msgInstance)
        })

        return JSON.stringify(messages)
      } else if (dmId && !channelId) {
        const rawMessages = await supabase
          .from('messages')
          .select('*')
          .eq('dm_id', dmId)

        if (rawMessages.error) {
          return new Response(JSON.stringify(rawMessages.error), {
            status: rawMessages.status
          })
        }

        const messages: {
          message: Tables<'messages'>
          author: Tables<'users'>
        }[] = []

        const authorPromises = rawMessages.data.map(async msg => {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', msg.author_id)
            .limit(1)
            .single()

          if (error) return null
          return { message: msg, author: data }
        })

        const values = await Promise.all(authorPromises)
        values.forEach(msgInstance => {
          if (msgInstance) messages.push(msgInstance)
        })

        return JSON.stringify(messages)
      } else return new Response('channelId veya dmId yok', { status: 400 })
    },
    {
      body: t.ObjectString({
        channelId: t.Optional(t.Number()),
        dmId: t.Optional(t.Number())
      })
    }
  )
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
    const user = await supabase
      .from('users')
      .select('*')
      .eq('id', Number(id))
      .limit(1)
      .single()

    return JSON.stringify(user.data)
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
      .limit(1)
      .single()

    if (dbUser.error)
      return new Response(JSON.stringify(dbUser.error), {
        status: dbUser.status
      })
    return new Response(JSON.stringify(dbUser), { status: dbUser.status })
  })
  .get('/servers/:token', async ({ params }) => {
    const { token } = params
    if (!token) return new Response('server token yok', { status: 400 })
    const { error, data } = await supabase
      .from('servers')
      .select('*')
      .eq('token', token)
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
          console.error(
            `Error fetching channel with id ${_channel.channel_id}:`,
            error
          )
          return null
        }
        return data
      })

      const values = await Promise.all(promises)
      values.forEach(channel => {
        if (channel) channels.push(channel)
      })

      return {
        server: data,
        defaultChannel: defaultChannel,
        serverChannels: channels
      }
    } else if (data == null) {
      return new Response('Server bulunamadı', { status: 404 })
    } else return new Response('Server sıçtı', { status: 500 })
  })
  .get('/channels/:id', async ({ params }) => {
    const { id } = params
    const { data, error, status } = await supabase
      .from('channels')
      .select('*')
      .eq('id', Number(id))
      .limit(1)
      .single();

    if (error) return new Response(JSON.stringify(error), { status })
    if (!data) return new Response(JSON.stringify('Error fetching channel reis 213'), { status })

    const server = await supabase
      .from('servers')
      .select('*')
      // @ts-ignore
      .eq('id', data.server_id)

    


    return new Response(JSON.stringify(data), { status })
  })
  .listen(9999)

console.log(`calisiypr supe.r 😃👍`)
