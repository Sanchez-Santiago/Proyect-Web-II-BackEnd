import 'dotenv/config';
import dns from 'node:dns';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

dns.setDefaultResultOrder('ipv4first');

const prisma = new PrismaClient();

const ID = {
  COMPRADOR: '00000000-0000-0000-0000-000000000001',
  VENDEDOR: '00000000-0000-0000-0000-000000000002',
  ADMIN: '00000000-0000-0000-0000-000000000003',
  FEATURE_ABS: '00000000-0000-0000-0000-000000000101',
  FEATURE_AIRBAGS: '00000000-0000-0000-0000-000000000102',
  FEATURE_CAMARA: '00000000-0000-0000-0000-000000000103',
  FEATURE_SENSOR: '00000000-0000-0000-0000-000000000104',
  FEATURE_BLUETOOTH: '00000000-0000-0000-0000-000000000105',
  FEATURE_CUERO: '00000000-0000-0000-0000-000000000106',
  FEATURE_TECHO: '00000000-0000-0000-0000-000000000107',
  FEATURE_GPS: '00000000-0000-0000-0000-000000000108',
  VEHICLE_COROLLA: '00000000-0000-0000-0000-000000000201',
  VEHICLE_RANGER: '00000000-0000-0000-0000-000000000202',
  VEHICLE_AMAROK: '00000000-0000-0000-0000-000000000203',
  VEHICLE_CIVIC: '00000000-0000-0000-0000-000000000204',
  VEHICLE_CRONOS: '00000000-0000-0000-0000-000000000205',
  VEHICLE_ONIX: '00000000-0000-0000-0000-000000000206',
  PUB_COROLLA: '00000000-0000-0000-0000-000000000301',
  PUB_RANGER: '00000000-0000-0000-0000-000000000302',
  PUB_AMAROK: '00000000-0000-0000-0000-000000000303',
  PUB_CIVIC: '00000000-0000-0000-0000-000000000304',
  PUB_CRONOS: '00000000-0000-0000-0000-000000000305',
  PUB_ONIX: '00000000-0000-0000-0000-000000000306',
  CHAT_1: '00000000-0000-0000-0000-000000000401',
  CHAT_2: '00000000-0000-0000-0000-000000000402',
  USER_SANTIAGO: '00000000-0000-0000-0000-000000000004',
  VEHICLE_TAHOE: '00000000-0000-0000-0000-000000000207',
  VEHICLE_A4: '00000000-0000-0000-0000-000000000208',
  PUB_TAHOE: '00000000-0000-0000-0000-000000000307',
  PUB_A4: '00000000-0000-0000-0000-000000000308',
  CHAT_3: '00000000-0000-0000-0000-000000000403',
};

const IMAGES = {
  corolla1: 'https://picsum.photos/seed/corolla1/800/600',
  corolla2: 'https://picsum.photos/seed/corolla2/800/600',
  ranger1: 'https://picsum.photos/seed/ranger1/800/600',
  ranger2: 'https://picsum.photos/seed/ranger2/800/600',
  amarok1: 'https://picsum.photos/seed/amarok1/800/600',
  amarok2: 'https://picsum.photos/seed/amarok2/800/600',
  civic1: 'https://picsum.photos/seed/civic1/800/600',
  civic2: 'https://picsum.photos/seed/civic2/800/600',
  cronos1: 'https://picsum.photos/seed/cronos1/800/600',
  cronos2: 'https://picsum.photos/seed/cronos2/800/600',
  onix1: 'https://picsum.photos/seed/onix1/800/600',
  onix2: 'https://picsum.photos/seed/onix2/800/600',
  tahoe1: 'https://picsum.photos/seed/tahoe1/800/600',
  tahoe2: 'https://picsum.photos/seed/tahoe2/800/600',
  a4_1: 'https://picsum.photos/seed/a4_1/800/600',
  a4_2: 'https://picsum.photos/seed/a4_2/800/600',
};

async function main() {
  console.log('Limpiando datos existentes...');
  await prisma.auditLog.deleteMany();
  await prisma.vehicleView.deleteMany();
  await prisma.report.deleteMany();
  await prisma.savedSearch.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.publicationStatusHistory.deleteMany();
  await prisma.publicationFeature.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.vehicleAnalytics.deleteMany();
  await prisma.vehicleImage.deleteMany();
  await prisma.vehicleDocument.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.vehicleFeature.deleteMany();
  await prisma.buyerPreference.deleteMany();
  await prisma.passwordHistory.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creando usuarios...');
  const passwordHash = await bcrypt.hash('Test1234!', 10);

  await prisma.user.createMany({
    data: [
      { id: ID.COMPRADOR, fullName: 'Juan Pérez', email: 'comprador@test.com', passwordHash, role: 'BUYER', phone: '+5493511111111', province: 'Córdoba', city: 'Córdoba' },
      { id: ID.VENDEDOR, fullName: 'María García', email: 'vendedor@test.com', passwordHash, role: 'SELLER', verified: true, phone: '+5493512222222', province: 'Córdoba', city: 'Córdoba' },
      { id: ID.ADMIN, fullName: 'Admin Sistema', email: 'admin@test.com', passwordHash, role: 'ADMIN', verified: true, phone: '+5493513333333', province: 'Buenos Aires', city: 'CABA' },
      { id: ID.USER_SANTIAGO, fullName: 'Santiago Sánchez', email: 'santiago.sanchez@prueva.com', passwordHash, role: 'BUYER', phone: '+5493514444444', province: 'Córdoba', city: 'Córdoba' },
    ],
  });

  console.log('Creando características de vehículos...');
  await prisma.vehicleFeature.createMany({
    data: [
      { id: ID.FEATURE_ABS, featureName: 'ABS' },
      { id: ID.FEATURE_AIRBAGS, featureName: 'Airbags' },
      { id: ID.FEATURE_CAMARA, featureName: 'Cámara de retroceso' },
      { id: ID.FEATURE_SENSOR, featureName: 'Sensor de estacionamiento' },
      { id: ID.FEATURE_BLUETOOTH, featureName: 'Bluetooth' },
      { id: ID.FEATURE_CUERO, featureName: 'Asientos de cuero' },
      { id: ID.FEATURE_TECHO, featureName: 'Techo solar' },
      { id: ID.FEATURE_GPS, featureName: 'GPS' },
    ],
  });

  console.log('Creando vehículos...');
  await prisma.vehicle.createMany({
    data: [
      { id: ID.VEHICLE_COROLLA, brand: 'Toyota', model: 'Corolla', year: 2022, vehicleType: 'SEDAN', fuelType: 'GASOLINE', transmission: 'CVT', color: 'Blanco', mileage: 35000, doors: 5, engine: '2.0L 4Cil', ownersCount: 1, sellerId: ID.VENDEDOR },
      { id: ID.VEHICLE_RANGER, brand: 'Ford', model: 'Ranger', year: 2023, vehicleType: 'TRUCK', fuelType: 'DIESEL', transmission: 'AUTOMATIC', color: 'Negro', mileage: 18000, doors: 4, engine: '3.2L 5Cil', ownersCount: 1, sellerId: ID.VENDEDOR },
      { id: ID.VEHICLE_AMAROK, brand: 'Volkswagen', model: 'Amarok', year: 2021, vehicleType: 'TRUCK', fuelType: 'DIESEL', transmission: 'AUTOMATIC', color: 'Gris', mileage: 52000, doors: 4, engine: '2.0L TDI', ownersCount: 2, sellerId: ID.VENDEDOR },
      { id: ID.VEHICLE_CIVIC, brand: 'Honda', model: 'Civic', year: 2020, vehicleType: 'SEDAN', fuelType: 'GASOLINE', transmission: 'AUTOMATIC', color: 'Azul', mileage: 48000, doors: 5, engine: '1.8L 4Cil', ownersCount: 1, sellerId: ID.VENDEDOR },
      { id: ID.VEHICLE_CRONOS, brand: 'Fiat', model: 'Cronos', year: 2024, vehicleType: 'SEDAN', fuelType: 'GASOLINE', transmission: 'MANUAL', color: 'Rojo', mileage: 5000, doors: 5, engine: '1.3L 4Cil', ownersCount: 1, sellerId: ID.VENDEDOR },
      { id: ID.VEHICLE_ONIX, brand: 'Chevrolet', model: 'Onix', year: 2022, vehicleType: 'HATCHBACK', fuelType: 'GASOLINE', transmission: 'MANUAL', color: 'Plateado', mileage: 28000, doors: 5, engine: '1.2L Turbo', ownersCount: 1, sellerId: ID.VENDEDOR },
      { id: ID.VEHICLE_TAHOE, brand: 'Chevrolet', model: 'Tahoe', year: 2023, vehicleType: 'SUV', fuelType: 'GASOLINE', transmission: 'AUTOMATIC', color: 'Negro', mileage: 15000, doors: 5, engine: '5.3L V8', ownersCount: 1, sellerId: ID.VENDEDOR },
      { id: ID.VEHICLE_A4, brand: 'Audi', model: 'A4', year: 2022, vehicleType: 'SEDAN', fuelType: 'GASOLINE', transmission: 'AUTOMATIC', color: 'Blanco', mileage: 22000, doors: 5, engine: '2.0L TFSI', ownersCount: 1, sellerId: ID.VENDEDOR },
    ],
  });

  console.log('Creando imágenes...');
  await prisma.vehicleImage.createMany({
    data: [
      { vehicleId: ID.VEHICLE_COROLLA, imageUrl: IMAGES.corolla1, imageName: 'Corolla frente' },
      { vehicleId: ID.VEHICLE_COROLLA, imageUrl: IMAGES.corolla2, imageName: 'Corolla lateral' },
      { vehicleId: ID.VEHICLE_RANGER, imageUrl: IMAGES.ranger1, imageName: 'Ranger frente' },
      { vehicleId: ID.VEHICLE_RANGER, imageUrl: IMAGES.ranger2, imageName: 'Ranger lateral' },
      { vehicleId: ID.VEHICLE_AMAROK, imageUrl: IMAGES.amarok1, imageName: 'Amarok frente' },
      { vehicleId: ID.VEHICLE_AMAROK, imageUrl: IMAGES.amarok2, imageName: 'Amarok lateral' },
      { vehicleId: ID.VEHICLE_CIVIC, imageUrl: IMAGES.civic1, imageName: 'Civic frente' },
      { vehicleId: ID.VEHICLE_CIVIC, imageUrl: IMAGES.civic2, imageName: 'Civic lateral' },
      { vehicleId: ID.VEHICLE_CRONOS, imageUrl: IMAGES.cronos1, imageName: 'Cronos frente' },
      { vehicleId: ID.VEHICLE_CRONOS, imageUrl: IMAGES.cronos2, imageName: 'Cronos lateral' },
      { vehicleId: ID.VEHICLE_ONIX, imageUrl: IMAGES.onix1, imageName: 'Onix frente' },
      { vehicleId: ID.VEHICLE_ONIX, imageUrl: IMAGES.onix2, imageName: 'Onix lateral' },
      { vehicleId: ID.VEHICLE_TAHOE, imageUrl: IMAGES.tahoe1, imageName: 'Tahoe frente' },
      { vehicleId: ID.VEHICLE_TAHOE, imageUrl: IMAGES.tahoe2, imageName: 'Tahoe lateral' },
      { vehicleId: ID.VEHICLE_A4, imageUrl: IMAGES.a4_1, imageName: 'Audi A4 frente' },
      { vehicleId: ID.VEHICLE_A4, imageUrl: IMAGES.a4_2, imageName: 'Audi A4 lateral' },
    ],
  });

  console.log('Creando análisis IA...');
  await prisma.vehicleAnalytics.createMany({
    data: [
      { vehicleId: ID.VEHICLE_COROLLA, paintCondition: 4, engineCondition: 5, interiorCondition: 4, tiresCondition: 4, overallScore: 85, estimatedPrice: 18500, damageDetected: 'Sin daños visibles. Excelente estado de conservación.', confidenceScore: 0.88 },
      { vehicleId: ID.VEHICLE_RANGER, paintCondition: 5, engineCondition: 5, interiorCondition: 5, tiresCondition: 5, overallScore: 95, estimatedPrice: 42000, damageDetected: 'Vehículo en estado impecable, como nuevo.', confidenceScore: 0.92 },
      { vehicleId: ID.VEHICLE_AMAROK, paintCondition: 3, engineCondition: 4, interiorCondition: 3, tiresCondition: 3, overallScore: 72, estimatedPrice: 28000, damageDetected: 'Desgaste normal para la edad. Detalles estéticos menores.', confidenceScore: 0.81 },
      { vehicleId: ID.VEHICLE_CIVIC, paintCondition: 4, engineCondition: 4, interiorCondition: 4, tiresCondition: 3, overallScore: 78, estimatedPrice: 16500, damageDetected: 'Buen estado general. Se recomienda cambiar neumáticos próximamente.', confidenceScore: 0.84 },
      { vehicleId: ID.VEHICLE_CRONOS, paintCondition: 5, engineCondition: 5, interiorCondition: 5, tiresCondition: 5, overallScore: 98, estimatedPrice: 22000, damageDetected: 'Vehículo 0km prácticamente. Sin observaciones.', confidenceScore: 0.95 },
      { vehicleId: ID.VEHICLE_ONIX, paintCondition: 4, engineCondition: 4, interiorCondition: 4, tiresCondition: 4, overallScore: 82, estimatedPrice: 15500, damageDetected: 'Buen estado general. Mantenimiento al día.', confidenceScore: 0.86 },
      { vehicleId: ID.VEHICLE_TAHOE, paintCondition: 5, engineCondition: 5, interiorCondition: 5, tiresCondition: 5, overallScore: 97, estimatedPrice: 55000, damageDetected: 'Vehículo premium en estado impecable. Cero detalles.', confidenceScore: 0.96 },
      { vehicleId: ID.VEHICLE_A4, paintCondition: 4, engineCondition: 5, interiorCondition: 5, tiresCondition: 4, overallScore: 90, estimatedPrice: 38000, damageDetected: 'Excelente estado general. Solo pequeños detalles estéticos.', confidenceScore: 0.91 },
    ],
  });

  console.log('Creando publicaciones...');
  await prisma.publication.createMany({
    data: [
      { id: ID.PUB_COROLLA, vehicleId: ID.VEHICLE_COROLLA, sellerId: ID.VENDEDOR, title: 'Toyota Corolla 2022 - Impecable', description: 'Vendo mi Toyota Corolla 2022 en excelente estado. Siempre guardado en cochera, service oficial al día. Ideal para familia o viajes.', price: 18900, currency: 'USD', province: 'Córdoba', city: 'Córdoba', status: 'ACTIVE' },
      { id: ID.PUB_RANGER, vehicleId: ID.VEHICLE_RANGER, sellerId: ID.VENDEDOR, title: 'Ford Ranger 2023 4x4 Limited', description: 'Pick up Ford Ranger Limited 2023, full equipo. Caja automática de 10 velocidades, tracción 4x4. Impecable, solo 18000 km.', price: 43500, currency: 'USD', province: 'Córdoba', city: 'Córdoba', status: 'ACTIVE' },
      { id: ID.PUB_AMAROK, vehicleId: ID.VEHICLE_AMAROK, sellerId: ID.VENDEDOR, title: 'VW Amarok Highline 2021', description: 'Volkswagen Amarok Highline 3.0 V6 TDI. Con enganche, cubiertas nuevas. Ideal para trabajo y uso diario.', price: 29500, currency: 'USD', province: 'Córdoba', city: 'Villa María', status: 'ACTIVE' },
      { id: ID.PUB_CIVIC, vehicleId: ID.VEHICLE_CIVIC, sellerId: ID.VENDEDOR, title: 'Honda Civic EX 2020 - Un dueño', description: 'Honda Civic EX 2020, un solo dueño. Service oficial Honda. Muy buen estado general, listo para transferir.', price: 17000, currency: 'USD', province: 'Santa Fe', city: 'Rosario', status: 'ACTIVE' },
      { id: ID.PUB_CRONOS, vehicleId: ID.VEHICLE_CRONOS, sellerId: ID.VENDEDOR, title: 'Fiat Cronos 2024 0km', description: 'Fiat Cronos 0km con 5000 km. Cobertura de garantía oficial. Ahorro en patente y consumo.', price: 21500, currency: 'USD', province: 'Córdoba', city: 'Córdoba', status: 'PENDING' },
      { id: ID.PUB_ONIX, vehicleId: ID.VEHICLE_ONIX, sellerId: ID.VENDEDOR, title: 'Chevrolet Onix 2022 - VENDIDO', description: 'Chevrolet Onix 2022 1.2 Turbo. VEHICULO VENDIDO.', price: 15000, currency: 'USD', province: 'Buenos Aires', city: 'La Plata', status: 'SOLD' },
      { id: ID.PUB_TAHOE, vehicleId: ID.VEHICLE_TAHOE, sellerId: ID.VENDEDOR, title: 'Chevrolet Tahoe 2023 - Premium', description: 'Chevrolet Tahoe 2023, full equipo. Motor V8 5.3L, pantalla táctil, asientos de cuero, cámara 360°. Ideal para viajes largos en confort absoluto.', price: 56000, currency: 'USD', province: 'Córdoba', city: 'Córdoba', status: 'ACTIVE' },
      { id: ID.PUB_A4, vehicleId: ID.VEHICLE_A4, sellerId: ID.VENDEDOR, title: 'Audi A4 2022 - Tecnología y confort', description: 'Audi A4 2.0 TFSI Quattro. Equipamiento completo: techo solar, navegador, asientos deportivos. Un dueño, service oficial. Caja automática S-Tronic.', price: 38500, currency: 'USD', province: 'Buenos Aires', city: 'CABA', status: 'ACTIVE' },
    ],
  });

  console.log('Vinculando características a publicaciones...');
  await prisma.publicationFeature.createMany({
    data: [
      { publicationId: ID.PUB_COROLLA, featureId: ID.FEATURE_ABS },
      { publicationId: ID.PUB_COROLLA, featureId: ID.FEATURE_AIRBAGS },
      { publicationId: ID.PUB_COROLLA, featureId: ID.FEATURE_BLUETOOTH },
      { publicationId: ID.PUB_COROLLA, featureId: ID.FEATURE_CAMARA },
      { publicationId: ID.PUB_RANGER, featureId: ID.FEATURE_ABS },
      { publicationId: ID.PUB_RANGER, featureId: ID.FEATURE_AIRBAGS },
      { publicationId: ID.PUB_RANGER, featureId: ID.FEATURE_CAMARA },
      { publicationId: ID.PUB_RANGER, featureId: ID.FEATURE_SENSOR },
      { publicationId: ID.PUB_RANGER, featureId: ID.FEATURE_BLUETOOTH },
      { publicationId: ID.PUB_RANGER, featureId: ID.FEATURE_GPS },
      { publicationId: ID.PUB_AMAROK, featureId: ID.FEATURE_ABS },
      { publicationId: ID.PUB_AMAROK, featureId: ID.FEATURE_AIRBAGS },
      { publicationId: ID.PUB_AMAROK, featureId: ID.FEATURE_BLUETOOTH },
      { publicationId: ID.PUB_CIVIC, featureId: ID.FEATURE_ABS },
      { publicationId: ID.PUB_CIVIC, featureId: ID.FEATURE_AIRBAGS },
      { publicationId: ID.PUB_CIVIC, featureId: ID.FEATURE_CAMARA },
      { publicationId: ID.PUB_CRONOS, featureId: ID.FEATURE_ABS },
      { publicationId: ID.PUB_CRONOS, featureId: ID.FEATURE_BLUETOOTH },
      { publicationId: ID.PUB_ONIX, featureId: ID.FEATURE_ABS },
      { publicationId: ID.PUB_ONIX, featureId: ID.FEATURE_AIRBAGS },
      { publicationId: ID.PUB_ONIX, featureId: ID.FEATURE_BLUETOOTH },
      { publicationId: ID.PUB_TAHOE, featureId: ID.FEATURE_ABS },
      { publicationId: ID.PUB_TAHOE, featureId: ID.FEATURE_AIRBAGS },
      { publicationId: ID.PUB_TAHOE, featureId: ID.FEATURE_CAMARA },
      { publicationId: ID.PUB_TAHOE, featureId: ID.FEATURE_SENSOR },
      { publicationId: ID.PUB_TAHOE, featureId: ID.FEATURE_BLUETOOTH },
      { publicationId: ID.PUB_TAHOE, featureId: ID.FEATURE_CUERO },
      { publicationId: ID.PUB_TAHOE, featureId: ID.FEATURE_TECHO },
      { publicationId: ID.PUB_TAHOE, featureId: ID.FEATURE_GPS },
      { publicationId: ID.PUB_A4, featureId: ID.FEATURE_ABS },
      { publicationId: ID.PUB_A4, featureId: ID.FEATURE_AIRBAGS },
      { publicationId: ID.PUB_A4, featureId: ID.FEATURE_CAMARA },
      { publicationId: ID.PUB_A4, featureId: ID.FEATURE_SENSOR },
      { publicationId: ID.PUB_A4, featureId: ID.FEATURE_BLUETOOTH },
      { publicationId: ID.PUB_A4, featureId: ID.FEATURE_CUERO },
      { publicationId: ID.PUB_A4, featureId: ID.FEATURE_TECHO },
      { publicationId: ID.PUB_A4, featureId: ID.FEATURE_GPS },
    ],
  });

  console.log('Creando historial de precio...');
  await prisma.priceHistory.createMany({
    data: [
      { publicationId: ID.PUB_COROLLA, amount: 19800, currency: 'USD' },
      { publicationId: ID.PUB_ONIX, amount: 16500, currency: 'USD' },
    ],
  });

  console.log('Creando historial de estado...');
  await prisma.publicationStatusHistory.createMany({
    data: [
      { publicationId: ID.PUB_CRONOS, oldStatus: 'PENDING', newStatus: 'PENDING' },
      { publicationId: ID.PUB_ONIX, oldStatus: 'ACTIVE', newStatus: 'SOLD' },
    ],
  });

  console.log('Creando favoritos...');
  await prisma.favorite.createMany({
    data: [
      { userId: ID.COMPRADOR, publicationId: ID.PUB_COROLLA },
      { userId: ID.COMPRADOR, publicationId: ID.PUB_RANGER },
      { userId: ID.COMPRADOR, publicationId: ID.PUB_CIVIC },
    ],
  });

  console.log('Creando chats y mensajes...');
  await prisma.chat.createMany({
    data: [
      { id: ID.CHAT_1, publicationId: ID.PUB_COROLLA },
      { id: ID.CHAT_2, publicationId: ID.PUB_RANGER },
    ],
  });

  await prisma.message.createMany({
    data: [
      { chatId: ID.CHAT_1, userId: ID.COMPRADOR, message: 'Hola, me interesa el Corolla. **¿Está disponible para verlo?**', status: 'READ' },
      { chatId: ID.CHAT_1, userId: ID.VENDEDOR, message: 'Hola Juan! Sí, está disponible. *¿Cuándo te gustaría pasar?*', status: 'READ' },
      { chatId: ID.CHAT_1, userId: ID.COMPRADOR, message: 'Puedo pasar mañana a la tarde. ¿Te queda bien?', status: 'DELIVERED' },
      { chatId: ID.CHAT_2, userId: ID.COMPRADOR, message: 'Buen día, quería saber si la Ranger tiene la caja automática.', status: 'SENT' },
      { chatId: ID.CHAT_2, userId: ID.VENDEDOR, message: 'Sí! Tiene caja automática de 10 velocidades. Es una maravilla.', status: 'SENT' },
      { chatId: ID.CHAT_2, userId: ID.COMPRADOR, message: 'Perfecto, gracias por la info!', status: 'SENT' },
    ],
  });

  await prisma.chat.createMany({
    data: [
      { id: ID.CHAT_3, publicationId: ID.PUB_TAHOE },
    ],
  });

  await prisma.message.createMany({
    data: [
      { chatId: ID.CHAT_3, userId: ID.USER_SANTIAGO, message: 'Hola, quería consultar por la Chevrolet Tahoe. ¿Sigue disponible?', status: 'SENT' },
    ],
  });

  console.log('Creando notificaciones...');
  await prisma.notification.createMany({
    data: [
      { userId: ID.COMPRADOR, type: 'price_drop', title: 'Bajó de precio', message: 'El Toyota Corolla que guardaste bajó de $19.800 a $18.900 USD' },
      { userId: ID.COMPRADOR, type: 'new_message', title: 'Nuevo mensaje', message: 'María García te respondió sobre el Toyota Corolla' },
      { userId: ID.COMPRADOR, type: 'favorite_sold', title: 'Publicación vendida', message: 'Uno de tus favoritos fue marcado como vendido' },
      { userId: ID.VENDEDOR, type: 'new_message', title: 'Nuevo mensaje', message: 'Juan Pérez te envió un mensaje sobre la Ford Ranger' },
      { userId: ID.VENDEDOR, type: 'publication_approved', title: 'Publicación aprobada', message: 'Tu publicación del Toyota Corolla ya está activa' },
      { userId: ID.ADMIN, type: 'pending_review', title: 'Publicación pendiente', message: 'El Fiat Cronos 2024 está esperando revisión' },
      { userId: ID.USER_SANTIAGO, type: 'welcome', title: 'Bienvenido a MotorMarket', message: 'Gracias por registrarte. Explorá los mejores autos con ayuda de IA.' },
    ],
  });

  console.log('Creando vistas de vehículos...');
  await prisma.vehicleView.createMany({
    data: [
      { publicationId: ID.PUB_COROLLA, userId: ID.COMPRADOR },
      { publicationId: ID.PUB_COROLLA },
      { publicationId: ID.PUB_RANGER, userId: ID.COMPRADOR },
      { publicationId: ID.PUB_AMAROK },
    ],
  });

  console.log('Creando búsquedas guardadas...');
  await prisma.savedSearch.createMany({
    data: [
      { userId: ID.COMPRADOR, filtersJson: { brand: 'Toyota', status: 'ACTIVE', priceMax: 25000 } },
      { userId: ID.COMPRADOR, filtersJson: { vehicleType: 'TRUCK', status: 'ACTIVE', yearMin: 2020 } },
    ],
  });

  console.log('Creando preferencias del comprador...');
  await prisma.buyerPreference.createMany({
    data: [
      { userId: ID.COMPRADOR, minimumBudget: 10000, maximumBudget: 50000, preferredBrand: 'Toyota', minimumYear: 2018 },
    ],
  });

  console.log('\n✅ Seed completado exitosamente!');
  console.log('\n📋 Credenciales de prueba:');
  console.log('   Comprador: comprador@test.com / Test1234!');
  console.log('   Vendedor:  vendedor@test.com / Test1234!');
  console.log('   Admin:     admin@test.com / Test1234!');
  console.log('   Santiago:  santiago.sanchez@prueva.com / Test1234!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
