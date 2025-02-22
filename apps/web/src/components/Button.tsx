'use client'

import React from 'react'

const Button = ({
  children,
  onClick
}: {
  children: React.ReactNode,
  onClick?: () => void
}) => {
  return (
    <button onClick={onClick} className='rounded-lg bg-indigo-500 hover:bg-indigo-600 transition px-3 py-2'>
      {children}
    </button>)
}

export default Button
