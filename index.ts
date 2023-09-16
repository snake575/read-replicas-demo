import { PrismaClient } from '@prisma/client'
import { readReplicas } from '@prisma/extension-read-replicas'

const prisma = new PrismaClient().$extends(
  readReplicas({
    url: process.env.DATABASE_REPLICA_URL!,
  }),
)

await prisma.user.deleteMany()
await prisma.post.deleteMany()

await prisma.user.create({
  data: {
    email: 'my@email.com',
    posts: {
      create: {
        title: 'My post',
      },
    },
  },
})

console.log(
  'Post Author from Primary: ',
  await prisma.$primary().post.findFirst().author(),
)
console.log(
  'Post Author from Replica: ',
  await prisma.post.findFirst().author(),
)
