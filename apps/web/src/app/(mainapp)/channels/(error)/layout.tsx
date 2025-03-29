import React from 'react'

const ErrorLayout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default ErrorLayout