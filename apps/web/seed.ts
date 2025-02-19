import { db } from "@/db";

(async () => {
  await db.$connect();
  const servers = await db.server.findMany();
  servers.forEach(async server => {
    await db.user.update({
      where: {
        clerk_id: 'user_2tDYT2UIlXVfrvPDMaqCfV6gUbp'
      },
      data: {
        serverIds: {
          push: server.id
        },
        servers: {
          update: {
            where: {
              id: server.id
            },
            data: {
              name: server.name,
              imageUrl: server.imageUrl,
              bannerUrl: server.bannerUrl
            }
          }
        }
    }})
    console.log(`Added Server: ${server.name}`)
  })
  await db.$disconnect();
})();