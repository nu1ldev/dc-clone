'use client'
import { useUser } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const clerkUser = useUser();
  const user = useQuery({ queryKey: ['channels'], queryFn: async () => {
      const req = await fetch(`http://localhost:9999/get-user`, {
        method: 'POST',
        body: JSON.stringify({
          clerk_id: clerkUser.user?.id
      })})
      if (!req.ok) {
        throw new Error('Failed to fetch user')
      }
      return await req.json()
    }
  })
  return (
    <div className='w-full h-full flex flex-row'>
      <div className='flex flex-col gap-y-0 w-10/12 items-center justify-start'>
        {user.data && JSON.stringify([].concat(user.data.friends).concat(user.data.friendsOf))}
      </div>
    </div>
  );
}
