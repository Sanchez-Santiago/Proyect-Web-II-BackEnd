import 'dotenv/config';
import * as dns from 'node:dns';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

dns.setDefaultResultOrder('ipv4first');

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL is not defined in environment variables');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaPg(pool as any);

export const prisma = new PrismaClient({ adapter });

export default prisma;
