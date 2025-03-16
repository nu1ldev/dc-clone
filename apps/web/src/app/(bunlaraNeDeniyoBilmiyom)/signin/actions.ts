'use server'

import { createClient } from '@/utils/supabase/server'

export async function signin(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const authResult = await supabase.auth.signInWithPassword(data)

  if (authResult.error) {
    return { status: 'error', error: authResult.error, user: null }
  }

  return { status: 'success', user: authResult.data.user, error: null }
}