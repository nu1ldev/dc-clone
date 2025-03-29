'use server'

import { TablesInsert } from "@/database.types"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

export const sendMessage = async (message: TablesInsert<'messages'>) => {
  const { error, statusText, status } = await supabase
    .from('messages')
    .insert(message)

  if (error) return error
  return { status, statusText }
}