// apps/api/src/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;        // default export
export { prisma };            // (optional) named export if you want it
