import { PrismaClient } from '@prisma/client'
import type {
  User,
  Server,
  Channel,
  Message,
  Dm,
  FriendRequests
} from '@prisma/client'

export const db = new PrismaClient()

export type { User, Server, Channel, Message, Dm, FriendRequests }
