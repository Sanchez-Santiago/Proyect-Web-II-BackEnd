import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL is not defined in environment variables');
}

export const prisma = new PrismaClient();

export default prisma;
