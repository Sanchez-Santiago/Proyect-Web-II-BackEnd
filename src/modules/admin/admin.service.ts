import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { prisma } from '../../models/prisma';

function omitPassword<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function sumDecimal(values: Array<number | string | Prisma.Decimal>) {
  return values.reduce<number>((sum, value) => sum + Number(value || 0), 0);
}

@Injectable()
export class AdminService {
  async findUsers(filters?: { role?: UserRole; search?: string }) {
    const where: Prisma.UserWhereInput = {};

    if (filters?.role) where.role = filters.role;
    if (filters?.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { province: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        buyerPreference: true,
        _count: {
          select: {
            vehicles: true,
            publications: true,
            favorites: true,
            messages: true,
            reports: true,
            savedSearches: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(omitPassword);
  }

  async findUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        buyerPreference: true,
        vehicles: { include: { images: true, publication: true } },
        publications: { include: { vehicle: { include: { images: true } } } },
        favorites: { include: { publication: { include: { vehicle: { include: { images: true } } } } } },
        reports: true,
        savedSearches: true,
        _count: {
          select: {
            vehicles: true,
            publications: true,
            favorites: true,
            messages: true,
            reports: true,
            savedSearches: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return omitPassword(user);
  }

  async updateUser(id: string, data: { role?: UserRole; verified?: boolean; province?: string; city?: string; phone?: string }) {
    const user = await prisma.user.update({
      where: { id },
      data,
      include: {
        buyerPreference: true,
        _count: {
          select: {
            vehicles: true,
            publications: true,
            favorites: true,
            messages: true,
            reports: true,
            savedSearches: true,
          },
        },
      },
    });

    return omitPassword(user);
  }

  async deleteUser(id: string) {
    await prisma.user.delete({ where: { id } });
    return { message: 'Usuario eliminado' };
  }

  async getSummary() {
    const [
      users,
      publications,
      vehicles,
      reports,
      chats,
      messages,
      favorites,
      views,
      features,
      documents,
      analytics,
      savedSearches,
    ] = await Promise.all([
      prisma.user.findMany({ select: { id: true, role: true, verified: true, createdAt: true, province: true, city: true } }),
      prisma.publication.findMany({
        include: {
          vehicle: { include: { images: true, analytics: true } },
          seller: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.vehicle.findMany({ select: { id: true, brand: true, model: true, vehicleType: true, fuelType: true, transmission: true, year: true, createdAt: true } }),
      prisma.report.findMany({ include: { user: { select: { id: true, fullName: true, email: true } }, publication: true }, orderBy: { createdAt: 'desc' } }),
      prisma.chat.findMany({ select: { id: true, createdAt: true } }),
      prisma.message.findMany({ select: { id: true, createdAt: true, status: true } }),
      prisma.favorite.findMany({ select: { id: true, createdAt: true, publicationId: true } }),
      prisma.vehicleView.findMany({ select: { id: true, createdAt: true, publicationId: true, userId: true } }),
      prisma.vehicleFeature.findMany({ select: { id: true, featureName: true } }),
      prisma.vehicleDocument.findMany({ select: { id: true, verified: true, documentType: true, createdAt: true } }),
      prisma.vehicleAnalytics.findMany({ select: { id: true, overallScore: true, confidenceScore: true, estimatedPrice: true, createdAt: true } }),
      prisma.savedSearch.findMany({ select: { id: true, createdAt: true, userId: true } }),
    ]);

    const publicationStatus = publications.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    const userRoles = users.reduce<Record<string, number>>((acc, item) => {
      acc[item.role] = (acc[item.role] || 0) + 1;
      return acc;
    }, {});

    const reportStatus = reports.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    const totalPublicationValue = sumDecimal(publications.map((item) => item.price));
    const averagePublicationPrice = publications.length ? totalPublicationValue / publications.length : 0;
    const averageAiScore = analytics.length
      ? analytics.reduce((sum, item) => sum + Number(item.overallScore || item.confidenceScore || 0), 0) / analytics.length
      : 0;

    const topPublications = publications.slice(0, 10).map((publication) => ({
      id: publication.id,
      title: publication.title || `${publication.vehicle.brand} ${publication.vehicle.model} ${publication.vehicle.year}`,
      status: publication.status,
      price: publication.price,
      currency: publication.currency,
      createdAt: publication.createdAt,
      seller: publication.seller,
      vehicle: publication.vehicle,
      views: views.filter((view) => view.publicationId === publication.id).length,
      favorites: favorites.filter((favorite) => favorite.publicationId === publication.id).length,
      reports: reports.filter((report) => report.publicationId === publication.id).length,
    }));

    const alerts = [
      ...reports
        .filter((report) => report.status === 'PENDING')
        .map((report) => ({
          id: `report:${report.id}`,
          type: 'REPORT',
          severity: 'HIGH',
          title: report.reason || 'Reporte pendiente',
          message: report.description || 'Reporte de publicación pendiente de revisión.',
          createdAt: report.createdAt,
          reportId: report.id,
          publicationId: report.publicationId,
        })),
      ...publications
        .filter((publication) => publication.status === 'PENDING')
        .map((publication) => ({
          id: `publication:${publication.id}`,
          type: 'PUBLICATION_PENDING',
          severity: 'MEDIUM',
          title: 'Publicación pendiente',
          message: `${publication.vehicle.brand} ${publication.vehicle.model} espera moderación.`,
          createdAt: publication.createdAt,
          publicationId: publication.id,
        })),
    ].sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));

    return {
      totals: {
        users: users.length,
        verifiedUsers: users.filter((user) => user.verified).length,
        vehicles: vehicles.length,
        publications: publications.length,
        activePublications: publicationStatus.ACTIVE || 0,
        pendingPublications: publicationStatus.PENDING || 0,
        soldPublications: publicationStatus.SOLD || 0,
        reports: reports.length,
        pendingReports: reportStatus.PENDING || 0,
        chats: chats.length,
        messages: messages.length,
        favorites: favorites.length,
        views: views.length,
        features: features.length,
        documents: documents.length,
        verifiedDocuments: documents.filter((doc) => doc.verified).length,
        analytics: analytics.length,
        savedSearches: savedSearches.length,
        totalPublicationValue,
        averagePublicationPrice,
        averageAiScore,
      },
      breakdowns: {
        userRoles,
        publicationStatus,
        reportStatus,
        vehicleTypes: vehicles.reduce<Record<string, number>>((acc, item) => {
          acc[item.vehicleType] = (acc[item.vehicleType] || 0) + 1;
          return acc;
        }, {}),
        fuelTypes: vehicles.reduce<Record<string, number>>((acc, item) => {
          acc[item.fuelType] = (acc[item.fuelType] || 0) + 1;
          return acc;
        }, {}),
      },
      topPublications,
      recentReports: reports.slice(0, 10),
      alerts,
      features,
    };
  }

  async getTimeline(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [users, publications, reports, messages, favorites, views] = await Promise.all([
      prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.publication.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true, price: true } }),
      prisma.report.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.message.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.favorite.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.vehicleView.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    ]);

    const buckets: Record<string, any> = {};
    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - offset);
      buckets[toDayKey(date)] = {
        date: toDayKey(date),
        users: 0,
        publications: 0,
        reports: 0,
        messages: 0,
        favorites: 0,
        views: 0,
        publicationValue: 0,
      };
    }

    users.forEach((item) => { buckets[toDayKey(item.createdAt)].users += 1; });
    publications.forEach((item) => {
      const bucket = buckets[toDayKey(item.createdAt)];
      bucket.publications += 1;
      bucket.publicationValue += Number(item.price || 0);
    });
    reports.forEach((item) => { buckets[toDayKey(item.createdAt)].reports += 1; });
    messages.forEach((item) => { buckets[toDayKey(item.createdAt)].messages += 1; });
    favorites.forEach((item) => { buckets[toDayKey(item.createdAt)].favorites += 1; });
    views.forEach((item) => { buckets[toDayKey(item.createdAt)].views += 1; });

    return { days, points: Object.values(buckets) };
  }
}
