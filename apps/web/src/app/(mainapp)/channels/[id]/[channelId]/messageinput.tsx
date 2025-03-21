'use client'

import { Tables } from '@/database.types';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react'

const Messageinput = ({ channel }: { channel: Tables<'channels'> }) => {
  const [message, setMessage] = useState<string>('')
  const [file, setFile] = useState<File | null>(null);

  const supabase = createClient()
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      console.log('Uploading file...');
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        // You can write the URL of your server or any other endpoint used for file upload
        const { data, error } = await supabase.storage
          .from('embeds')
          .upload('', file)
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className='flex flex-row items-center rounded-lg my-6 mx-4 p-2 relative gap-x-3 bg-white/10'>
      <button 
        className='flex items-center'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='size-6'
        >
          <path
            fillRule='evenodd'
            d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z'
            clipRule='evenodd'
          />
        </svg>
      </button>
      <input
        className='bg-transparent outline-none w-full'
        placeholder={`Send a message to #${channel.name}`}
        onKeyUp={e => e.key === 'Enter' && console.log('sent message')}
        onChange={e => setMessage(e.currentTarget.value)}
        autoFocus
        type='text'
      />
    </div>
  )
}

export default Messageinput
