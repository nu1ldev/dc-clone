'use client'

import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import React, { createContext, useContext } from 'react'

export type ContextValueType = {
  type: 'server' | 'dm' | null
  id: string | null
}

export const CurrentChannelContext = createContext({
  type: null,
  id: null
} as ContextValueType)

const contextinho = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname()
  const pathId = pathName.replace('/channels', '') // 67b4ccc... (database id aynısını veriyo yes be)
  const { data, isLoading, isError, error, status } = useQuery({
    queryKey: ['channel_or_server'],
    queryFn: async () => {
      const req = await fetch(`http://localhost:9999/get-channel`, {
        method: 'POST',
        body: JSON.stringify({ id: `${pathId.replace('/', '')}` })
      })
      return await req.json()
    }
  })
  const bambambam: ContextValueType =
    data
      ? { type: 'dm', id: pathId }
      : { type: 'server', id: pathId }

  return (
    <CurrentChannelContext.Provider value={bambambam}>
      {children}
    </CurrentChannelContext.Provider>
  )
}

export default contextinho
