import React from 'react'

interface ModalProps {
  children: React.ReactNode
  title: string
  close: () => void
}

const Modal = ({ children, title, close }: ModalProps) => {
  return (
    <div onClick={close} className='bg-black/30 left-0 top-0 absolute w-full h-full z-[99] flex items-center justify-center'>
      <div id='modal' className='bg-primary h-fit w-[400px] rounded-2xl py-8 px-4 z-[9999] flex flex-col gap-y-5'>
        <div id='top' className='text-white/70 text-lg flex flex-row justify-between'>
          <span className='text-nowrap italic'>{title}</span>
          <div className='w-full'/>
          <button onClick={close} className='right-0'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className='flex flex-col gap-y-3 z-[9999]'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal