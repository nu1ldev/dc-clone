import { db } from "@/db";

// nu1ldev.id = 67b495fac2acffcd5c2d92a5
// ankaralilar06.id = 67b4ccc543cde1c16b35215c

(async () => {
  await db.$connect();
  await db.message.createMany({
    data: [
      {
        channelId: '67b636d017cb92218264d3d6',
        content: 'General bambambam',
        authorId: '67b495fac2acffcd5c2d92a5'
      },
      {
        channelId: '67b636d017cb92218264d3d6',
        content: 'bayri mallık var mı, yok mu? bambambam. Fenerbahçe mi, Galatasaray mı? bambambam, Beşiktaş mı, Trabzonspor mu? bambambam, Ankaragücü mü, Gençlerbirliği mi? bambambam, bırak futbolu, basketbol mu, voleybol mu? bambambam, bırak sporu, siyaset mi, ekonomi mi? bambambam, bırak siyaseti, bilim mi, sanat mı? bambambam, bırak sanatı, kadın mı, erkek mi? bambambam, bırak cinsiyeti, insan mı, hayvan mı? bambambam, bırak hayvanı, dünya mı, evren mi? bambambam, bırak dünyayı',
        authorId: '67b495fac2acffcd5c2d92a5'
      }
    ]
  })
  console.log('Created messages');
  await db.$disconnect();
})();