'use client'

import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import React, { createContext, SetStateAction, useContext, useEffect, useState } from 'react'

export type ContextValueType = {
  type: 'server' | 'dm' | 'home' | null
  id: string | null
}

type ContextType = {
  value: ContextValueType,
  setter: (a: ContextValueType) => void
}

export const CurrentChannelContext = createContext({ value: { type: null, id: null }, setter: () => '' } as ContextType)

const contextinho = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname()
  const pathId = pathName.replace('/channels', '').includes('/')
    ? pathName.replace('/channels', '').split('/')[1]
    : pathName.replace('/channels', '')
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['channel_or_server'],
    queryFn: async () => {
      const req = await fetch(`http://localhost:9999/get-channel`, {
        method: 'POST',
        body: JSON.stringify({ id: `${pathId.replace('/', '')}` })
      })
      return await req.json()
    }
  })
  const [bambambam, setBambambam] = useState<ContextValueType>({ type: 'home', id: null })
  return (
    <CurrentChannelContext.Provider value={{ value: bambambam, setter: (a) => setBambambam(a) }}>
      {children}
    </CurrentChannelContext.Provider>
  )
}

export default contextinho
