import { PrismaClient as NBAPrismaClient } from '../generated/prisma-nba';
import { PrismaClient as UsersPrismaClient } from '../generated/prisma-users';

const globalForPrisma = global as unknown as {
  users_prisma: UsersPrismaClient;
  nba_prisma: NBAPrismaClient;
};

export const users_prisma = globalForPrisma.users_prisma || new UsersPrismaClient();
export const nba_prisma = globalForPrisma.nba_prisma || new NBAPrismaClient();
