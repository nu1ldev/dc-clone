import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../../globals.css'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/db'
import Servers from '@/components/Servers'
import SidebarTopAndMain from '@/components/SidebarAndMain'

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
  const user = await currentUser()
  const dbUser = await db.user.findUnique({
    where: {
      clerk_id: user!.id
    }
  })
  // #1d1e21
  return (
    <div
      className={`w-full h-full flex flex-row ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <Servers user={dbUser!} />
      <SidebarTopAndMain>{children}</SidebarTopAndMain>
    </div>
  )
}
