# Plataforma Inteligente de Compra y Venta de Autos Usados

## Descripción del Proyecto

Plataforma web backend para la gestión de compra y venta de vehículos usados, desarrollada con NestJS. El sistema permite a vendedores publicar vehículos y a compradores buscar, filtrar, guardar favoritos y contactar vendedores. Incluye análisis inteligente del estado del vehículo mediante IA, chat en tiempo real, y gestión de documentos.

**Materia:** Web II  
**Institución:** Instituto Universitario Aeronáutico (IUA)

## Autores

- Santiago Javier Sanchez
- Giuliano Ayrton Pucci

## Tecnologías

| Tecnología | Propósito |
|------------|-----------|
| **NestJS** | Framework Node.js con arquitectura modular |
| **TypeScript** | Lenguaje de programación tipado |
| **Prisma ORM** | ORM para gestión de base de datos PostgreSQL (v6) |
| **PostgreSQL** | Base de datos relacional (Supabase hosted) |
| **Zod** | Validación de esquemas y tipos |
| **JWT** | Autenticación stateless con refresh tokens |
| **bcrypt** | Hash de contraseñas |
| **Socket.io** | Chat en tiempo real |
| **Cloudinary** | Almacenamiento de imágenes |

## Arquitectura

### Base de Datos

- **19 modelos** de Prisma:
  - User, Vehicle, VehicleImage, VehicleDocument, VehicleFeature
  - Publication, PublicationFeature, PublicationStatusHistory
  - Chat, Message
  - Favorite, BuyerPreference
  - Notification, RefreshToken, PasswordHistory
  - VehicleAnalytics, VehicleView, Report, SavedSearch, AuditLog

- **9 enums**:
  - Role (BUYER, SELLER, ADMIN)
  - VehicleType, FuelType, Transmission, PublicationStatus
  - ReportStatus, DocumentType, MessageStatus

### Estructura del Proyecto

```
src/
├── main.ts                    # Punto de entrada
├── app.module.ts             # Módulo raíz (15 módulos)
│
├── modules/                  # Módulos de funcionalidad
│   ├── auth/               # Autenticación JWT + Refresh Tokens
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── refresh-token.service.ts
│   │   ├── password.service.ts
│   │   └── dto/
│   ├── vehicles/            # Gestión de vehículos (datos técnicos)
│   ├── publications/        # Publicaciones de venta
│   ├── chat/                # Chat + WebSocket (Socket.io)
│   ├── favorites/           # Favoritos por publicación
│   ├── user-preferences/   # Preferencias del buyer
│   ├── ai-analysis/        # Análisis de IA (VehicleAnalytics)
│   ├── notifications/      # Notificaciones del usuario
│   ├── reports/            # Denuncias (admin)
│   ├── vehicle-features/  # Catálogo de características (admin)
│   ├── vehicle-views/      # Tracking de vistas
│   ├── saved-searches/     # Búsquedas guardadas
│   ├── documents/          # Documentos de vehículos
│   ├── upload/             # Upload a Cloudinary
│   └── home/               # Documentación API (HTML)
│
├── models/                  # Modelos de datos Prisma
│   ├── prisma.ts          # Cliente Prisma
│   └── *.model.ts         # Métodos por entidad
│
├── guards/                  # Guards de autenticación
│   ├── jwt.guard.ts       # Validación JWT (header/cookie/query)
│   └── roles.guard.ts    # Control de roles (ADMIN)
│
├── decorators/             # Decoradores personalizados
│   └── roles.decorator.ts
│
├── gateways/              # WebSocket
│   └── chat.gateway.ts   # Chat en tiempo real
│
└── common/                # Utilidades comunes
    └── utils/
        └── hash.util.ts
```

## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| **ADMIN** | Gestiona usuarios, contenido, análisis de IA, features, reportes |
| **SELLER** | Publica y gestiona vehículos a la venta |
| **BUYER** | Busca, visualiza, guarda favoritos, contacta vendedores |

## Endpoints de API (73 total)

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Registrar nuevo usuario | No |
| POST | `/auth/login` | Iniciar sesión (retorna cookies + tokens) | No |
| POST | `/auth/refresh` | Rotar refresh token | No |
| POST | `/auth/logout` | Cerrar sesión (revoca refresh token) | Sí |
| POST | `/auth/change-password` | Cambiar contraseña (con historial) | Sí |
| GET | `/auth/me` | Obtener usuario autenticado | Sí |

### Vehículos (datos técnicos)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/vehicles` | Crear vehículo | Sí |
| GET | `/vehicles/filters` | Listar/buscar vehículos | No |
| GET | `/vehicles/:id` | Ver vehículo por ID | No |
| PUT | `/vehicles/:id` | Actualizar vehículo | Sí |
| DELETE | `/vehicles/:id` | Eliminar vehículo | Sí |
| POST | `/vehicles/:id/images` | Agregar imagen | Sí |
| POST | `/vehicles/:id/images/bulk` | Agregar múltiples imágenes | Sí |
| GET | `/vehicles/:id/images` | Listar imágenes | No |
| DELETE | `/vehicles/:id/images/:imageId` | Eliminar imagen | Sí |

### Publicaciones (datos de venta)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/publications` | Crear publicación | Sí |
| GET | `/publications/filters` | Listar publicaciones activas | No |
| GET | `/publications/:id` | Ver publicación | No |
| GET | `/publications/vehicle/:vehicleId` | Publicación de un vehículo | No |
| PUT | `/publications/:id` | Actualizar publicación | Sí |
| PUT | `/publications/:id/status` | Cambiar estado (ACTIVE/SOLD/PENDING/PAUSED) | Sí |
| DELETE | `/publications/:id` | Eliminar publicación | Sí |
| POST | `/publications/:id/features` | Agregar característica | Sí |
| DELETE | `/publications/:id/features/:featureId` | Quitar característica | Sí |
| GET | `/publications/:id/features` | Listar características | No |

### Chat (REST)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/chats` | Crear/obtener chat por publicación | Sí |
| GET | `/chats` | Mis chats | Sí |
| GET | `/chats/:id` | Ver chat | Sí |
| GET | `/chats/:id/messages` | Mensajes del chat | Sí |
| POST | `/chats/:id/messages` | Enviar mensaje | Sí |
| POST | `/chats/:id/read` | Marcar mensajes como leídos | Sí |
| GET | `/chats/:id/unread` | Contar no leídos | Sí |
| DELETE | `/chats/:id` | Eliminar chat | Sí |

### Chat (WebSocket)

- `joinChat` - Unirse a un chat
- `sendMessage` - Enviar mensaje
- `markAsRead` - Marcar como leído
- `leaveChat` - Salir del chat

### Favoritos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/favorites` | Agregar a favoritos (por publicationId) | Sí |
| DELETE | `/favorites/:publicationId` | Quitar de favoritos | Sí |
| GET | `/favorites` | Listar favoritos | Sí |
| GET | `/favorites/check/:publicationId` | Verificar si es favorito | Sí |

### Preferencias de Usuario

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/user-preferences` | Obtener preferencias | Sí |
| PUT | `/user-preferences` | Actualizar preferencias | Sí |
| DELETE | `/user-preferences` | Eliminar preferencias | Sí |

### Análisis de IA (VehicleAnalytics)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/ai-analysis` | Crear análisis IA | Sí |
| GET | `/ai-analysis/vehicle/:vehicleId` | Ver análisis de vehículo | Sí |
| PUT | `/ai-analysis/:id` | Actualizar análisis | Sí |
| DELETE | `/ai-analysis/:id` | Eliminar análisis | Sí |

### Vehicle Features (catálogo)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/vehicle-features` | Listar todas las características | No |
| GET | `/vehicle-features/:id` | Ver característica | No |
| POST | `/vehicle-features` | Crear característica | ADMIN |
| DELETE | `/vehicle-features/:id` | Eliminar característica | ADMIN |

### Vehicle Views (tracking)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/vehicle-views/publication/:id` | Registrar vista | No |
| GET | `/vehicle-views/publication/:id` | Ver vistas de publicación | No |
| GET | `/vehicle-views/publication/:id/count` | Contar vistas | No |
| GET | `/vehicle-views/my-views` | Mis vistas | Sí |

### Saved Searches

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/saved-searches` | Guardar búsqueda | Sí |
| GET | `/saved-searches` | Listar búsquedas guardadas | Sí |
| GET | `/saved-searches/:id` | Ver búsqueda | Sí |
| PUT | `/saved-searches/:id` | Actualizar búsqueda | Sí |
| DELETE | `/saved-searches/:id` | Eliminar búsqueda | Sí |

### Documents

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/documents/vehicle/:vehicleId` | Listar documentos | No |
| POST | `/documents/vehicle/:vehicleId` | Subir documento | Sí |
| POST | `/documents/:id/verify` | Verificar documento | ADMIN |
| DELETE | `/documents/:id` | Eliminar documento | Sí |

### Notifications

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/notifications` | Listar notificaciones | Sí |
| POST | `/notifications/:id/read` | Marcar como leída | Sí |
| POST | `/notifications/read-all` | Marcar todas como leídas | Sí |
| DELETE | `/notifications/:id` | Eliminar notificación | Sí |

### Reports

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/reports` | Crear reporte | Sí |
| GET | `/reports` | Listar reportes (admin) | ADMIN |
| GET | `/reports/:id` | Ver reporte | ADMIN |
| PUT | `/reports/:id/status` | Cambiar estado (admin) | ADMIN |
| DELETE | `/reports/:id` | Eliminar reporte (admin) | ADMIN |

### Upload

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/upload/image` | Subir imagen desde URL | Sí |

## Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Servidor
PORT=3000

# JWT
JWT_SECRET=tu_secreto_super_seguro_minimo_32_caracteres
JWT_EXPIRES_IN=7d

# CORS (separar múltiples orígenes con coma)
CORS_ORIGINS=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Supabase (opcional)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=tu_key
```

## Comandos

```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Iniciar producción
npm start

# Desarrollo con hot-reload
npm run start:dev

# Generar cliente Prisma
npm run prisma:generate

# Sincronizar base de datos
npm run prisma:push
```

## Características Principales

1. **Autenticación JWT avanzada**: Registro, login, logout, cambio de contraseña con historial, refresh token rotation con cookies httpOnly
2. **Separación Vehicle/Publication**: Datos técnicos del vehículo separados de la información de venta
3. **Gestión de Vehículos**: CRUD completo con validación Zod, gestión de imágenes
4. **Publicaciones**: CRUD con historial de precios y estados, asignación de features
5. **Sistema de Favoritos**: Por publicationId (no por vehicleId)
6. **Chat en tiempo real**: REST + WebSocket (Socket.io) con JWT auth en handshake
7. **Análisis de IA**: VehicleAnalytics con 8 campos de condición + score
8. **Preferencias de Buyer**: Presupuesto, marca, modelo, año
9. **Notificaciones**: Sistema de notificaciones por usuario
10. **Reports**: Denuncias de publicaciones con estados (PENDING, RESOLVED, DISMISSED)
11. **VehicleFeatures**: Catálogo de características (aire acondicionado, GPS, etc.)
12. **VehicleViews**: Tracking de vistas por publicación
13. **SavedSearches**: Guardar filtros de búsqueda
14. **Documents**: Gestión de documentos de vehículos (título, VTV, seguro, etc.)
15. **Subida de imágenes**: Integración con Cloudinary
16. **CORS configurable**: Desde variable de entorno

## Roadmap

- [x] Sistema de autenticación JWT + Refresh Tokens
- [x] Gestión de vehículos (CRUD completo)
- [x] Publicaciones separadas de vehículos
- [x] Búsqueda y filtrado de publicaciones
- [x] Sistema de favoritos (por publicación)
- [x] Chat REST + WebSocket
- [x] Análisis de IA del estado del vehículo
- [x] Preferencias de usuario (buyer)
- [x] Notificaciones
- [x] Reportes (admin)
- [x] Vehicle Features (admin)
- [x] Vehicle Views tracking
- [x] Saved Searches
- [x] Documents (vehículos)
- [x] Upload de imágenes (Cloudinary)

## Licencia

ISC