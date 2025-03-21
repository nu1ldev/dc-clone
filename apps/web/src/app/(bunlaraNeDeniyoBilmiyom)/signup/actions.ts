'use server'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) throw new Error('Email or password is missing')

  const emailCheck = await supabase
    .from('users')
    .select('email')
    .eq('email', email)

  if (emailCheck.data instanceof Array && emailCheck.data.length > 0) {
    throw new Error('Email already exists')
  }

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: formData.get('username') as string
      }
    }
  })

  if (error) {
    throw error
  }

  return data
}