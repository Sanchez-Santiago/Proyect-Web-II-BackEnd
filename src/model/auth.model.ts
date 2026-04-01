import 'dotenv/config';
import { PrismaClient, UserRole } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

export const UserModel = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { userPreference: true },
    });
  },

  async create(data: { name: string; email: string; password: string; role: UserRole; province: string; city: string }) {
    return prisma.user.create({ data });
  },

  async update(id: string, data: any) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  async findAll(filters?: { role?: UserRole; province?: string; city?: string }) {
    const where: any = {};
    if (filters?.role) where.role = filters.role;
    if (filters?.province) where.province = filters.province;
    if (filters?.city) where.city = filters.city;

    return prisma.user.findMany({ where });
  },
};

export default prisma;