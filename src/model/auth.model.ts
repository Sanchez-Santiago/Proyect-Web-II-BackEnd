import 'dotenv/config';
import { PrismaClient, SellerType, UserRole } from '../../generated/prisma/client';
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
      include: { preference: true },
    });
  },

  async create(data: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    birthDate: Date;
    phone: string;
    alternatePhone?: string;
    verified?: boolean;
    sellerType?: SellerType;
    businessName?: string;
    taxId?: string;
    contactEmail?: string;
    contactPhone?: string;
    province?: string;
    city?: string;
    address?: string;
    acceptsTradeIn?: boolean;
    sellerDescription?: string;
    aiAutoReply?: boolean;
  }) {
    return prisma.user.create({ data });
  },

  async update(id: string, data: any) {
    return prisma.user.update({ where: { id }, data });
  },

  async incrementFailedAttempts(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { failedAttempts: { increment: 1 } },
    });
  },

  async resetFailedAttempts(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { failedAttempts: 0 },
    });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  async findAll(filters?: { role?: UserRole }) {
    const where: any = {};
    if (filters?.role) where.role = filters.role;

    return prisma.user.findMany({ where });
  },
};

export default prisma;
