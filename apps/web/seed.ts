import { db } from "@/db";
import { ChannelType } from "@prisma/client";

// nu1ldev.id = 67b9c881ce6d899fa9563f92
// ankaralılar06.id = 67b9d6a506c01be8b4df8c77
// general.id = 67ba03e7b5db1baeaffe3eab

const date = new Date()
;(async () => {
  await db.$connect();
  await db.dm.create({
    data: {
      userIds: {
        set: ['67b9c881ce6d899fa9563f92', '67b9d6f54b01abe30275517f']
      },
      messages: {
        createMany: {
          data: [
            {
              authorId: '67b9c881ce6d899fa9563f92',
              content: 'bayri naber',
              sentAt: new Date(date.getFullYear(), date.getMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds())
            },
            {
              authorId: '67b9c881ce6d899fa9563f92',
              content: 'bayri yaz artık',
              sentAt: new Date(date.getFullYear(), date.getMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds())
            },
            {
              authorId: '67b9d6f54b01abe30275517f',
              content: 'bitiririm lan seni',
              sentAt: new Date(date.getFullYear(), date.getMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds())
            },
            {
              authorId: '67b9c881ce6d899fa9563f92',
              content: 'morbidlige devam mı',
              sentAt: new Date(date.getFullYear(), date.getMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds())
            },
            {
              authorId: '67b9d6f54b01abe30275517f',
              content: 'eşşek üskğdarı geçti ona göre ayafıonı deng al',
              sentAt: new Date(date.getFullYear(), date.getMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds())
            },
            
          ] 
        }
      },
      users: {
        connect: [
          {
            id: '67b9d6f54b01abe30275517f'
          },
          {
            id: '67b9c881ce6d899fa9563f92'
          }
        ]
      }
    }
  })
  console.log('created dm')
  await db.$disconnect();
})()