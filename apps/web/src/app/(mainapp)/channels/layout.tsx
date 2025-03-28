import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '../../globals.css'
import Servers from '@/components/Servers'
import SidebarTopAndMain from '@/components/SidebarAndMain'
import { createClient } from '@/utils/supabase/server'
import { Tables } from '@/database.types'
import { redirect } from 'next/navigation'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Discord Clone',
  description: 'Generated by create next app'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/signup')
  }

  const dbUser = await supabase
        .from('users')
        .select('*')
        .eq('token', user.id)
        .limit(1)
        .single()
        
  if (dbUser.error) {
    await supabase.auth.signOut()
    redirect('/signin')
  }
  return (
    <div
      className={`w-[100%] h-[100%] flex flex-row ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <Servers user={dbUser?.data as Tables<'users'>} />
      <SidebarTopAndMain>{children}</SidebarTopAndMain>
      <Toaster />
    </div>
  )
}
