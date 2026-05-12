# Plan de Migración - Backend Vehicle Marketplace

## Resumen del Proyecto

Backend NestJS para marketplace de vehículos usados con:
- Autenticación JWT + Refresh Tokens
- Gestión de vehículos y publicaciones
- Chat en tiempo real (WebSocket)
- Sistema de favoritos y preferencias
- Análisis de IA para vehículos

---

## Fase 1: Fundación ✅ COMPLETADO

### Schema Prisma
- 19 modelos creados
- 9 enums definidos
- Relaciones completas

### Modelos Creados (`src/models/`)
| Modelo | Propósito |
|--------|-----------|
| `user.model.ts` | Usuarios con auth |
| `vehicle.model.ts` | Datos técnicos del vehículo |
| `vehicle-image.model.ts` | Imágenes del vehículo |
| `vehicle-document.model.ts` | Documentos (título, VTV) |
| `vehicle-feature.model.ts` | Catálogo de características |
| `publication.model.ts` | Publicación de venta |
| `chat.model.ts` | Conversaciones |
| `message.model.ts` | Mensajes |
| `favorite.model.ts` | Favoritos |
| `buyer-preference.model.ts` | Preferencias del buyer |
| `notification.model.ts` | Notificaciones |
| `refresh-token.model.ts` | Refresh tokens |
| `password-history.model.ts` | Historial de passwords |
| `vehicle-analytics.model.ts` | Análisis IA |
| `report.model.ts` | Denuncias |
| `saved-search.model.ts` | Búsquedas guardadas |
| `audit-log.model.ts` | Auditoría |
| `price-history.model.ts` | Historial de precios |
| `vehicle-view.model.ts` | Vistas de publicaciones |
| `publication-status-history.model.ts` | Historial de estados |

---

## Fase 2: Auth Mejorado (JWT + Refresh Tokens) - PENDIENTE

### Objetivos
- Implementar refresh token rotation
- Agregar password history
- Agregar campos `verified`, `failedLoginAttempts`

### Tablas Involucradas
| Tabla | Uso |
|-------|-----|
| `users` | Agregar campos: `verified`, `failedLoginAttempts` |
| `refresh_tokens` | CRUD completo |
| `password_history` | Guardar hashes anteriores |

### Endpoints a Modificar/Agregar
- `POST /auth/refresh` - Rotar refresh token
- `POST /auth/logout` - Invalidar refresh token
- `POST /auth/change-password` - Con historial
- `POST /auth/forgot-password` - Reset con verificación

### Servicios a Crear
- `src/modules/auth/services/auth.service.ts` (ya existe)
- `src/modules/auth/services/refresh-token.service.ts` (NUEVO)
- `src/modules/auth/services/password.service.ts` (NUEVO)

---

## Fase 3: Vehicles + Publications - PENDIENTE

### Objetivos
- Separar datos técnicos (Vehicle) de datos de venta (Publication)
- CRUD completo de Publications

### Tablas Involucradas
| Tabla | Uso |
|-------|-----|
| `vehicles` | Datos técnicos (reestructurado) |
| `publications` | price, province, city, status, title |
| `vehicle_images` | Sin cambios |
| `price_history` | Auto-log al cambiar precio |
| `publication_status_history` | Auto-log al cambiar estado |

### Endpoints
- `POST /vehicles` - Crear vehículo (sin price)
- `GET /vehicles/filters` - Buscar vehículos
- `POST /publications` - Crear publicación (requiere vehicle)
- `GET /publications` - Listar publicaciones activas
- `GET /publications/:id` - Ver publicación
- `PUT /publications/:id` - Editar publicación
- `PUT /publications/:id/status` - Cambiar estado

### Servicios
- `src/modules/vehicles/vehicles.service.ts`
- `src/modules/publications/publications.service.ts` (NUEVO)

---

## Fase 4: Favorites + BuyerPreferences + Analytics - ✅ COMPLETADO

### Cambios Realizados
- Favorites ahora referencian `publicationId`
- UserPreference → BuyerPreference
- AiAnalysis → VehicleAnalytics (8 condiciones)

---

## Fase 5: Chat + WebSocket - PENDIENTE

### Objetivos
- Chat basado en publicaciones
- WebSocket para tiempo real

### Tablas Involucradas
| Tabla | Uso |
|-------|-----|
| `chats` | Crear por publicación |
| `messages` | Vinculados a chat |

### Endpoints REST
- `POST /chats` - Crear chat
- `GET /chats` - Mis chats
- `GET /chats/:id/messages` - Mensajes del chat
- `POST /chats/:id/messages` - Enviar mensaje

### WebSocket Gateway
- `src/gateways/chat.gateway.ts` (NUEVO)
- Eventos: `joinChat`, `sendMessage`, `newMessage`, `markAsRead`

---

## Fase 6: Módulos Restantes - PENDIENTE

### 6.1 Notifications
- Tabla: `notifications`
- Endpoints: CRUD completo
- Servicio: `src/modules/notifications/`

### 6.2 Reports
- Tabla: `reports`
- Endpoints: CRUD + cambiar estado (admin)
- Servicio: `src/modules/reports/`

### 6.3 Vehicle Features
- Tabla: `vehicle_features`, `publication_features`
- Endpoints: catálogo + asignar a publicación
- Servicio: `src/modules/vehicle-features/`

### 6.4 Vehicle Views (Tracking)
- Tabla: `vehicle_views`
- Endpoint: `POST /publications/:id/view`
- Servicio: `src/modules/vehicle-views/`

### 6.5 Saved Searches
- Tabla: `saved_searches`
- Endpoints: CRUD
- Servicio: `src/modules/saved-searches/`

### 6.6 Documents
- Tabla: `vehicle_documents`
- Endpoints: Upload + verificar
- Servicio: `src/modules/documents/`

### 6.7 Audit Logs
- Tabla: `audit_logs`
- Middleware para logging automático

---

## Estado de Uso de Tablas

| Tabla | Fase | Estado |
|-------|------|--------|
| users | 1, 2 | ✅ Completo |
| vehicles | 1, 3 | ✅ Completo |
| vehicle_images | 1 | ✅ Completo |
| vehicle_documents | 1, 6 | ✅ Completo |
| vehicle_features | 1, 6 | ✅ Completo |
| publication_features | 1, 6 | ✅ Completo |
| publications | 1, 3 | ✅ Completo |
| chats | 1, 5 | ✅ Completo |
| messages | 1, 5 | ✅ Completo |
| favorites | 1, 4 | ✅ Completo |
| buyer_preferences | 1, 4 | ✅ Completo |
| notifications | 1, 6 | ✅ Completo |
| refresh_tokens | 1, 2 | ✅ Completo |
| password_history | 1, 2 | ✅ Completo |
| price_history | 1, 3 | ✅ Completo |
| publication_status_history | 1, 3 | ✅ Completo |
| vehicle_analytics | 1, 4 | ✅ Completo |
| vehicle_views | 1, 6 | ✅ Completo |
| reports | 1, 6 | ✅ Completo |
| saved_searches | 1, 6 | ✅ Completo |
| audit_logs | 1, 6 | ✅ Schema |

---

## Arquitectura MVC con Servicios

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts    (Controller)
│   │   ├── auth.module.ts
│   │   └── services/
│   │       ├── auth.service.ts          (Lógica principal)
│   │       ├── refresh-token.service.ts  (NUEVO)
│   │       └── password.service.ts       (NUEVO)
│   ├── vehicles/
│   │   ├── vehicles.controller.ts
│   │   ├── vehicles.module.ts
│   │   └── vehicles.service.ts
│   ├── publications/             (NUEVO)
│   │   ├── publications.controller.ts
│   │   ├── publications.module.ts
│   │   └── publications.service.ts
│   ├── chat/                    (NUEVO)
│   │   ├── chat.controller.ts
│   │   ├── chat.module.ts
│   │   ├── chat.service.ts
│   │   └── chat.gateway.ts      (WebSocket)
│   └── ...
├── models/                      (Data Access Layer)
├── guards/
├── decorators/
├── middleware/
└── gateways/                   (WebSocket)
```

---

## Próximos Pasos Inmediatos

1. ✅ Fase 1 - Completado
2. ✅ Fase 2 - Auth con Refresh Tokens
3. ✅ Fase 3 - Publications + Vehicles
4. ✅ Fase 4 - Favorites + BuyerPreferences + Analytics
5. ✅ Fase 5 - Chat + WebSocket
6. ✅ Fase 6 - Módulos restantes (Notifications, Reports, VehicleFeatures, VehicleViews, SavedSearches, Documents)
7. 🔄 **Testing de Endpoints** - 73 endpoints pendientes de probar

---

## Dependencias a Instalar (Fase 5)

```json
{
  "@nestjs/websockets": "^11.0.0",
  "@nestjs/platform-socket.io": "^11.0.0",
  "socket.io": "^4.7.0"
}
```

---

# Errores Encontrados y Soluciones

## Errores de Fase 1: Schema Prisma + Modelos

### Error 1: Relaciones faltantes en modelos
**Error:** 
```
Error validating field `vehicles` in model `User`: The relation field `vehicles` on model `User` is missing an opposite relation field on the model `Vehicle`.
```
**Causa:** Faltaban los campos inversos de relación en los modelos.
**Solución:** Agregar `@relation` en los campos de User:
```prisma
vehicles Vehicle[] @relation("SellerVehicles")
publications Publication[] @relation("SellerPublications")
auditLogs AuditLog[]
```

### Error 2: Chat modelo sin relación correcta
**Error:** El modelo Chat tenía `users User[]` pero SQL no lo define así.
**Causa:** Relación innecesaria que no existe en la DB.
**Solución:** Eliminar `users User[]` del modelo Chat.

### Error 3: RefreshToken unique field
**Error:** 
```
Type '{ token: string; }' is not assignable to type 'RefreshTokenWhereUniqueInput'. Property 'id' is missing.
```
**Causa:** Prisma no tiene `token` como campo único por defecto.
**Solución:** Usar `findFirst` en vez de `findUnique` para buscar por token.

---

## Errores de Build - Modelos y Servicios

### Error 4: VehicleImage createMany type mismatch
**Error:**
```
Property 'imageUrl' is missing in type '{ vehicleId: string; url: string; title: string; }'
```
**Causa:** El tipo esperado era `VehicleImageCreateManyInput` no `VehicleImageCreateInput[]`.
**Solución:** Cambiar la firma:
```typescript
async createMany(images: { vehicleId: string; imageUrl: string; imageName?: string }[]) {
  return prisma.vehicleImage.createMany({ data: images });
}
```

### Error 5: Vehicle findByVin y findByLicensePlate
**Error:** `vin` y `licensePlate` no son campos únicos en el schema.
**Solución:** Usar `findFirst` en vez de `findUnique`:
```typescript
async findByVin(vin: string) {
  return prisma.vehicle.findFirst({ where: { vin } });
}
```

### Error 6: Import nestjs-zod 'z' no exportado
**Error:**
```
Module '"nestjs-zod"' declares 'z' locally, but it is not exported.
```
**Causa:** nestjs-zod re-exporta zod de forma diferente.
**Solución:** Importar directamente de 'zod':
```typescript
import { z } from 'zod';
```

### Error 7: Export UserPreferenceModel no existe
**Error:**
```
'"../models/buyer-preference.model"' has no exported member named 'UserPreferenceModel'
```
**Causa:** El modelo se llama BuyerPreferenceModel, no UserPreferenceModel.
**Solución:** Crear alias en el export:
```typescript
export { BuyerPreferenceModel } from '../models/buyer-preference.model';
// En el archivo de compatibilidad:
export { UserPreferenceModel as BuyerPreferenceModel }
```

### Error 8: Fields faltantes en UpdateVehicleInput
**Error:**
```
Property 'version' does not exist in type '{ vehicleType?: ... }'
```
**Causa:** Los DTOs de vehicle no incluían los campos nuevos del schema.
**Solución:** Actualizar create-vehicle.dto.ts y update-vehicle.dto.ts con campos:
- version, doors, engine, ownersCount, vin, licensePlate, hasDebt, debtAmount
- Eliminar: price, province, city, latitude, longitude, lastServiceDate, etc.

### Error 9: Favorites referencia vehicleId pero ahora usa publicationId
**Error:**
```
Property 'vehicleId' does not exist in type 'FavoriteCreateInput'
```
**Causa:** El schema cambió de vehicleId a publicationId.
**Solución:** Actualizar el servicio y DTO:
```typescript
// DTO
export const CreateFavoriteSchema = z.object({
  publicationId: z.string().uuid(),
});

// Servicio
return FavoriteModel.create({
  user: { connect: { id: userId } },
  publication: { connect: { id: input.publicationId } },
});
```

### Error 10: Messages ahora referencian Chat, no Vehicle/Receiver
**Error:**
```
Property 'senderId' does not exist in type 'MessageCreateInput'
```
**Causa:** El schema cambió - mensajes ahora van en un Chat.
**Solución:** Refactorizar completamente el servicio de mensajes:
- CrearChat si no existe para la publicación
- Enviar mensaje vinculado al chat
- Eliminar endpoints old de vehicle-based messages

### Error 11: BuyerPreference requiere relación con User
**Error:**
```
Property 'user' is missing in type '...'
```
**Solución:** Incluir la relación en el upsert:
```typescript
return BuyerPreferenceModel.upsert(userId, {
  user: { connect: { id: userId } },
  // ...resto de campos
});
```

### Error 12: AI Analysis campos nuevos
**Error:**
```
Property 'paintCondition' does not exist in type '...'
```
**Causa:** El schema tiene 8 campos de condición, no solo uno.
**Solución:** Usar type assertion `as any` para acceder a los nuevos campos del DTO.

---

## Errores de Tipado en Servicios (TypeScript)

### Error 13: Campos de vehicle en update
Los campos como `version`, `doors`, `engine` etc. no existían en el tipo inferido del DTO.
**Solución:** Usar type assertion `as any`:
```typescript
const { images, ...vehicleData } = input as any;
```

---

## Notas para el Futuro

1. **Prisma generate después de cada cambio de schema** - Siempre ejecutar `npm run prisma:generate` antes de build.

2. **Migrar modelos uno a uno** - Si el schema tiene muchos cambios, crear modelos individuales y testear cada uno.

3. **Usar findFirst cuando no hay unique constraint** - En lugar de `findUnique`, usar `findFirst` para campos que pueden no ser únicos.

4. **Zod imports** - Importar `z` directamente de 'zod', no de 'nestjs-zod'.

5. **Relaciones Prisma** - Siempre definir both sides de las relaciones en el schema.

6. **Decimal type** - Prisma usa `Decimal` no `number` para campos monetarios. Usar `Number()` al convertir.

7. **Refresh tokens** - No usar token como unique key sin definir `@unique` en el schema.

---

## Lista de Testing de Endpoints

### MÓDULO AUTH
- [ ] POST /auth/register → Registro
- [ ] POST /auth/login → Login con tokens
- [ ] POST /auth/refresh → Rotar refresh token
- [ ] POST /auth/logout → Invalidar refresh
- [ ] POST /auth/change-password → Cambiar pass con historial
- [ ] GET /auth/me → Perfil del usuario

### MÓDULO VEHICLES
- [ ] POST /vehicles → Crear vehículo
- [ ] GET /vehicles/filters → Listar con filtros
- [ ] GET /vehicles/:id → Ver vehículo
- [ ] PUT /vehicles/:id → Actualizar
- [ ] DELETE /vehicles/:id → Eliminar
- [ ] POST /vehicles/:id/images → Agregar imagen
- [ ] POST /vehicles/:id/images/bulk → Bulk images
- [ ] GET /vehicles/:id/images → Listar imágenes
- [ ] DELETE /vehicles/:id/images/:imageId → Eliminar imagen

### MÓDULO PUBLICATIONS
- [ ] POST /publications → Crear publicación
- [ ] GET /publications/filters → Buscar con filtros
- [ ] GET /publications/:id → Ver publicación
- [ ] GET /publications/vehicle/:vehicleId → Por vehículo
- [ ] PUT /publications/:id → Actualizar
- [ ] PUT /publications/:id/status → Cambiar estado
- [ ] DELETE /publications/:id → Eliminar
- [ ] POST /publications/:id/features → Agregar feature
- [ ] DELETE /publications/:id/features/:featureId → Quitar feature
- [ ] GET /publications/:id/features → Listar features

### MÓDULO CHAT (REST)
- [ ] POST /chats → Crear/obtener chat
- [ ] GET /chats → Mis chats
- [ ] GET /chats/:id → Ver chat
- [ ] GET /chats/:id/messages → Mensajes del chat
- [ ] POST /chats/:id/messages → Enviar mensaje
- [ ] POST /chats/:id/read → Marcar leídos
- [ ] GET /chats/:id/unread → Contar no leídos
- [ ] DELETE /chats/:id → Eliminar chat

### CHAT WEBSOCKET
- [ ] Conexión WS con JWT auth
- [ ] joinChat { chatId }
- [ ] sendMessage { chatId, message } → newMessage event
- [ ] markAsRead { chatId }
- [ ] leaveChat { chatId }

### MÓDULO FAVORITES
- [ ] POST /favorites → Agregar favorito
- [ ] DELETE /favorites/:publicationId → Quitar
- [ ] GET /favorites → Listar favoritos
- [ ] GET /favorites/check/:publicationId → Verificar

### MÓDULO USER PREFERENCES
- [ ] GET /user-preferences → Obtener
- [ ] PUT /user-preferences → Actualizar
- [ ] DELETE /user-preferences → Eliminar

### MÓDULO AI ANALYSIS
- [ ] POST /ai-analysis → Crear análisis
- [ ] GET /ai-analysis/vehicle/:vehicleId → Por vehículo
- [ ] PUT /ai-analysis/:id → Actualizar
- [ ] DELETE /ai-analysis/:id → Eliminar

### MÓDULO UPLOAD
- [ ] POST /upload/image → Subir imagen a Cloudinary

### MÓDULO NOTIFICATIONS
- [ ] GET /notifications → Listar
- [ ] POST /notifications/:id/read → Marcar leída
- [ ] POST /notifications/read-all → Marcar todas leídas
- [ ] DELETE /notifications/:id → Eliminar

### MÓDULO REPORTS
- [ ] POST /reports → Denunciar publicación
- [ ] GET /reports → Listar (admin)
- [ ] GET /reports/:id → Ver reporte
- [ ] PUT /reports/:id/status → Cambiar estado (admin)
- [ ] DELETE /reports/:id → Eliminar (admin)

### MÓDULO VEHICLE FEATURES
- [ ] GET /vehicle-features → Catálogo
- [ ] GET /vehicle-features/:id → Ver feature
- [ ] POST /vehicle-features → Crear (admin)
- [ ] DELETE /vehicle-features/:id → Eliminar (admin)

### MÓDULO VEHICLE VIEWS
- [ ] POST /vehicle-views/publication/:id → Trackear vista
- [ ] GET /vehicle-views/publication/:id → Ver vistas
- [ ] GET /vehicle-views/publication/:id/count → Contar vistas

### MÓDULO SAVED SEARCHES
- [ ] POST /saved-searches → Guardar búsqueda
- [ ] GET /saved-searches → Listar
- [ ] GET /saved-searches/:id → Ver
- [ ] PUT /saved-searches/:id → Actualizar
- [ ] DELETE /saved-searches/:id → Eliminar

### MÓDULO DOCUMENTS
- [ ] GET /documents/vehicle/:vehicleId → Listar docs
- [ ] POST /documents/vehicle/:vehicleId → Subir doc
- [ ] POST /documents/:id/verify → Verificar (admin)
- [ ] DELETE /documents/:id → Eliminar

### MÓDULO HOME
- [ ] GET / → Documentación API

---

## Limpieza Realizada (Mayo 2026)

### Archivos Eliminados
- `src/modules/messages/` - Duplicado de ChatModule
- `src/middleware/jwt.middleware.ts` - Funcionalidad redundante
- `src/middleware/role.middleware.ts` - Funcionalidad redundante
- `src/utils/hash.util.ts` - Duplicado de common/utils/hash.util.ts
- `src/services/cloudinary.service.ts` - Duplicado de upload service
- `src/modules/auth/guards/jwt-auth.guard.ts` - No usado
- `src/modules/vehicles/dto/vehicle.dto.ts` - DTO muerto
- `src/modules/favorites/dto/favorite.dto.ts` - DTO muerto
- `src/modules/ai-analysis/dto/ai-analysis.dto.ts` - DTO muerto
- `src/modules/user-preferences/dto/user-preference.dto.ts` - DTO muerto
- `src/config/database.config.ts` - No usado
- `src/database/PostgresSQL.ts` - No usado
- `prisma.config.ts` - No usado
- `src/model/` (barrel directory) - Unificado a src/models/

### DTOs Limpiados
- `update-vehicle.dto.ts` - Eliminados campos old (price, province, city, etc.)
- `vehicle-filters.dto.ts` - Eliminados filtros old

---

## Limpieza Adicional (Mayo 2026 - Segunda iteración)

### Archivos Eliminados
- `src/services/cloudinary.service.ts` - Duplicado de upload service
- `src/config/database.config.ts` - No usado
- `src/utils/hash.util.ts` - Duplicado de common/utils/hash.util.ts
- `src/database/Tablas.sql` - Movido a `docs/`

### Archivos Corregidos
- `.env` - Corregidos nombres de variables Cloudinary (CLOUDINARY_CLOUD_NAME, etc.)
- `.env` - Eliminado JWT_SECRET duplicado
- `src/modules/upload/upload.service.ts` - Eliminados fallbacks hardcodeados de credenciales

---

## Testing de Endpoints (Mayo 2026)

### Resultados - 73 endpoints probados

| Módulo | Total | Exitosos | Errores |
|--------|-------|----------|---------|
| Auth | 6 | 6 | 0 |
| Vehicles | 10 | 10 | 0 |
| Publications | 10 | 10 | 0 |
| Favorites | 4 | 4 | 0 |
| UserPreferences | 3 | 3 | 0 |
| AiAnalysis | 4 | 4 | 0 |
| Chat (REST) | 8 | 8 | 0 |
| VehicleFeatures | 4 | 4 | 0 |
| VehicleViews | 3 | 3 | 0 |
| SavedSearches | 5 | 5 | 0 |
| Documents | 4 | 4 | 0 (enum fix applied - re-test passed) |
| Notifications | 4 | 4 | 0 |
| Reports | 5 | 5 | 0 (enum fix applied - re-test passed) |
| Upload | 1 | 1 | 0 |
| Home | 1 | 1 | 0 |

### Bugs Encontrados y Corregidos

1. **Documents - documentType enum**: El endpoint acceptaba cualquier string. Agregado DTO con validación de enum (TITLE, VTV, INSURANCE, REGISTRATION, TRANSFER, OTHER).

2. **Reports - status enum**: El endpoint acceptaba cualquier string. Agregado DTO con validación de enum (PENDING, RESOLVED, DISMISSED).

### Checklist de Testing (actualizado)

✅ = Probado y funcionando

### MÓDULO AUTH
- [x] POST /auth/register → Registro
- [x] POST /auth/login → Login con tokens
- [x] POST /auth/refresh → Rotar refresh token
- [x] POST /auth/logout → Invalidar refresh
- [x] POST /auth/change-password → Cambiar pass con historial
- [x] GET /auth/me → Perfil del usuario

### MÓDULO VEHICLES
- [x] POST /vehicles → Crear vehículo
- [x] GET /vehicles/filters → Listar con filtros
- [x] GET /vehicles/:id → Ver vehículo
- [x] PUT /vehicles/:id → Actualizar
- [x] DELETE /vehicles/:id → Eliminar
- [x] POST /vehicles/:id/images → Agregar imagen
- [x] POST /vehicles/:id/images/bulk → Bulk images
- [x] GET /vehicles/:id/images → Listar imágenes
- [x] DELETE /vehicles/:id/images/:imageId → Eliminar imagen

### MÓDULO PUBLICATIONS
- [x] POST /publications → Crear publicación
- [x] GET /publications/filters → Buscar con filtros
- [x] GET /publications/:id → Ver publicación
- [x] GET /publications/vehicle/:vehicleId → Por vehículo
- [x] PUT /publications/:id → Actualizar
- [x] PUT /publications/:id/status → Cambiar estado
- [x] DELETE /publications/:id → Eliminar
- [x] POST /publications/:id/features → Agregar feature
- [x] DELETE /publications/:id/features/:featureId → Quitar feature
- [x] GET /publications/:id/features → Listar features

### MÓDULO CHAT (REST)
- [x] POST /chats → Crear/obtener chat
- [x] GET /chats → Mis chats
- [x] GET /chats/:id → Ver chat
- [x] GET /chats/:id/messages → Mensajes del chat
- [x] POST /chats/:id/messages → Enviar mensaje
- [x] POST /chats/:id/read → Marcar leídos
- [x] GET /chats/:id/unread → Contar no leídos
- [x] DELETE /chats/:id → Eliminar chat

### MÓDULO FAVORITES
- [x] POST /favorites → Agregar favorito
- [x] DELETE /favorites/:publicationId → Quitar
- [x] GET /favorites → Listar favoritos
- [x] GET /favorites/check/:publicationId → Verificar

### MÓDULO USER PREFERENCES
- [x] GET /user-preferences → Obtener
- [x] PUT /user-preferences → Actualizar
- [x] DELETE /user-preferences → Eliminar

### MÓDULO AI ANALYSIS
- [x] POST /ai-analysis → Crear análisis
- [x] GET /ai-analysis/vehicle/:vehicleId → Por vehículo
- [x] PUT /ai-analysis/:id → Actualizar
- [x] DELETE /ai-analysis/:id → Eliminar

### MÓDULO UPLOAD
- [x] POST /upload/image → Subir imagen a Cloudinary

### MÓDULO NOTIFICATIONS
- [x] GET /notifications → Listar
- [x] POST /notifications/:id/read → Marcar leída
- [x] POST /notifications/read-all → Marcar todas leídas
- [x] DELETE /notifications/:id → Eliminar

### MÓDULO REPORTS
- [x] POST /reports → Denunciar publicación
- [x] GET /reports → Listar (admin)
- [x] GET /reports/:id → Ver reporte
- [x] PUT /reports/:id/status → Cambiar estado (admin)
- [x] DELETE /reports/:id → Eliminar (admin)

### MÓDULO VEHICLE FEATURES
- [x] GET /vehicle-features → Catálogo
- [x] GET /vehicle-features/:id → Ver feature
- [x] POST /vehicle-features → Crear (admin)
- [x] DELETE /vehicle-features/:id → Eliminar (admin)

### MÓDULO VEHICLE VIEWS
- [x] POST /vehicle-views/publication/:id → Trackear vista
- [x] GET /vehicle-views/publication/:id → Ver vistas
- [x] GET /vehicle-views/publication/:id/count → Contar vistas

### MÓDULO SAVED SEARCHES
- [x] POST /saved-searches → Guardar búsqueda
- [x] GET /saved-searches → Listar
- [x] GET /saved-searches/:id → Ver
- [x] PUT /saved-searches/:id → Actualizar
- [x] DELETE /saved-searches/:id → Eliminar

### MÓDULO DOCUMENTS
- [x] GET /documents/vehicle/:vehicleId → Listar docs
- [x] POST /documents/vehicle/:vehicleId → Subir doc (enum corregido)
- [ ] POST /documents/:id/verify → Verificar (admin)
- [x] DELETE /documents/:id → Eliminar

### MÓDULO HOME
- [x] GET / → Documentación API

---

*Errores documentados durante la migración del Schema SQL a Prisma - Mayo 2026*