# Plataforma Inteligente de Compra y Venta de Autos Usados

## Descripción del Proyecto

Plataforma web backend para la gestión de compra y venta de vehículos usados, desarrollada con NestJS. El sistema permite a vendedores publicar vehículos y a compradores buscar, filtrar y guardar favoritos. Incluye análisis inteligente del estado del vehículo mediante IA.

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
| **Prisma ORM** | ORM para gestión de base de datos PostgreSQL |
| **PostgreSQL** | Base de datos relacional (Supabase hosted) |
| **Zod** | Validación de esquemas y tipos |
| **JWT** | Autenticación stateless |
| **bcrypt** | Hash de contraseñas |
| **Supabase** | Storage y servicios cloud |
| **Cloudinary** | Almacenamiento de imágenes |

## Estructura del Proyecto

```
src/
├── main.ts                    # Punto de entrada
├── app.module.ts             # Módulo raíz
│
├── modules/                  # Módulos de funcionalidad
│   ├── auth/               # Autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dto/
│   ├── vehicles/            # Gestión de vehículos
│   │   ├── vehicles.controller.ts
│   │   ├── vehicles.service.ts
│   │   ├── vehicles.module.ts
│   │   └── dto/
│   ├── messages/            # Mensajes entre usuarios
│   │   ├── messages.controller.ts
│   │   ├── messages.service.ts
│   │   └── dto/
│   ├── favorites/           # Favoritos del usuario
│   │   ├── favorites.controller.ts
│   │   ├── favorites.service.ts
│   │   └── dto/
│   ├── user-preferences/   # Preferencias de búsqueda
│   │   ├── user-preferences.controller.ts
│   │   ├── user-preferences.service.ts
│   │   └── dto/
│   └── ai-analysis/        # Análisis de IA
│       ├── ai-analysis.controller.ts
│       ├── ai-analysis.service.ts
│       └── dto/
│
├── guards/                  # Guards de autenticación
│   ├── jwt.guard.ts       # Validación JWT
│   └── roles.guard.ts    # Control de roles
│
├── middleware/             # Middleware personalizado
│   ├── jwt.middleware.ts
│   └── role.middleware.ts
│
├── decorators/             # Decoradores personalizados
│   └── roles.decorator.ts
│
├── config/                 # Configuraciones
│   └── database.config.ts
│
├── common/                # Utilidades comunes
│   └── utils/
│       └── hash.util.ts
│
└── model/                 # Modelos de datos
    ├── auth.model.ts
    └── prisma.model.ts
```

## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| **ADMIN** | Gestiona usuarios, contenido y análisis de IA |
| **SELLER** | Publica y gestiona vehículos a la venta |
| **BUYER** | Busca, visualiza, guarda favoritos y contacta vendedores |

## Endpoints de API

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Registrar nuevo usuario | No |
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/logout` | Cerrar sesión | Sí |
| GET | `/auth/me` | Obtener usuario autenticado | Sí |

### Vehículos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/vehicles` | Crear nuevo vehículo | Sí |
| GET | `/vehicles/filters` |listar/buscar vehículos | No |
| GET | `/vehicles/filters/:id` | Ver vehículo por ID | No |
| GET | `/vehicles/:id` | Ver vehículo por ID | No |
| PUT | `/vehicles/:id` | Actualizar vehículo | Sí |
| DELETE | `/vehicles/:id` | Eliminar vehículo | Sí |

### Mensajes

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/messages` | Enviar mensaje | Sí |
| GET | `/messages/conversations` | Listar conversaciones | Sí |
| GET | `/messages/vehicle/:vehicleId` | Mensajes por vehículo | Sí |
| GET | `/messages/filters` | Buscar mensajes | Sí |
| GET | `/messages/:id` | Ver mensaje por ID | Sí |

### Favoritos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/favorites` | Agregar a favoritos | Sí |
| DELETE | `/favorites/:vehicleId` | Quitar de favoritos | Sí |
| GET | `/favorites` | Listar favoritos | Sí |
| GET | `/favorites/check/:vehicleId` | Verificar si es favorito | Sí |

### Preferencias de Usuario

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/user-preferences` | Obtener preferencias | Sí |
| PUT | `/user-preferences` | Actualizar preferencias | Sí |
| DELETE | `/user-preferences` | Eliminar preferencias | Sí |

### Análisis de IA

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/ai-analysis` | Crear análisis IA | Sí |
| GET | `/ai-analysis/vehicle/:vehicleId` | Ver análisis de vehículo | Sí |
| PUT | `/ai-analysis/:id` | Actualizar análisis | Sí |
| DELETE | `/ai-analysis/:id` | Eliminar análisis | Sí |

### Upload de Imágenes

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/upload/image` | Subir imagen desde URL | Sí |

## Ejemplos de Uso

### Registro de Usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "password": "Password123",
    "role": "BUYER"
  }'
```

**Respuesta:**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "role": "BUYER"
  }
}
```

### Iniciar Sesión

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@email.com",
    "password": "Password123"
  }'
```

**Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "role": "BUYER"
  }
}
```

### Buscar Vehículos (con filtros)

```bash
curl -X GET "http://localhost:3000/vehicles/filters?brand=Toyota&priceMax=30000" \
  -H "Authorization: Bearer <TOKEN>"
```

### Crear Vehículo

```bash
curl -X POST http://localhost:3000/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "vehicleType": "SEDAN",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2022,
    "color": "Negro",
    "fuelType": "GASOLINE",
    "transmission": "AUTOMATIC",
    "mileage": 15000,
    "price": 24000,
    "province": "Buenos Aires",
    "city": "La Plata",
    "interiorCondition": 8,
    "paintCondition": 9,
    "description": "Excelente estado"
  }'
```

### Agregar a Favoritos

```bash
curl -X POST http://localhost:3000/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"vehicleId": "uuid-del-vehiculo"}'
```

### Enviar Mensaje

```bash
curl -X POST http://localhost:3000/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "vehicleId": "uuid-del-vehiculo",
    "receiverId": "uuid-del-vendedor",
    "message": "Me interesa este vehículo"
  }'
```

### Actualizar Preferencias

```bash
curl -X PUT http://localhost:3000/user-preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "brands": ["Toyota", "Honda", "Ford"],
    "yearRange": [2018, 2024],
    "priceMax": 30000,
    "fuelTypes": ["GASOLINE", "HYBRID"]
  }'
```

## Filtros de Vehículos Disponibles

| Parámetro | Tipo | Descripción |
|-----------|------|------------|
| `brand` | string | Marca del vehículo |
| `model` | string | Modelo |
| `year` | number | Año específico |
| `yearMin` | number | Año mínimo |
| `yearMax` | number | Año máximo |
| `priceMin` | number | Precio mínimo |
| `priceMax` | number | Precio máximo |
| `vehicleType` | enum | Tipo de vehículo |
| `fuelType` | string | Tipo de combustible |
| `transmission` | string | Tipo de transmisión |
| `province` | string | Provincia |
| `city` | string | Ciudad |
| `sellerId` | uuid | ID del vendedor |

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

1. **Autenticación JWT**: Sistema seguro de registro y login con tokens JWT
2. **Gestión de Vehículos**: CRUD completo con validación Zod
3. **Sistema de Búsqueda**: Filtros avanzados por marca, año, precio, ubicación, etc.
4. **Favoritos**: Los compradores pueden guardar vehículos de interesa
5. **Mensajería**: Comunicación directa entre compradores y vendedores
6. **Análisis de IA**: Evaluación automática del estado del vehículo
7. **Preferencias**: Los usuarios pueden guardar criterios de búsqueda
8. **CORS Configurable**: Control de accesos desde variables de entorno

## Roadmap

- [x] Sistema de autenticación (registro, login, logout)
- [x] Gestión de vehículos (CRUD completo)
- [x] Búsqueda y filtrado de vehículos
- [x] Sistema de favoritos para compradores
- [x] Mensajería entre usuarios
- [x] Análisis de IA del estado del vehículo
- [x] Preferencias de usuario
- [ ] Panel de administración
- [ ] Notificaciones en tiempo real
- [ ] Upload de imágenes

## Licencia

ISC