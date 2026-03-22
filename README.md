# Plataforma de Compra y Venta de Autos Usados

## Descripción

Plataforma web para la compra y venta de vehículos usados, con análisis inteligente del estado del auto mediante IA.

**Materia:** Web II  
**Institución:** Instituto Universitario Aeronáutico (IUA)

## Autores

- Santiago Javier Sanchez
- Giuliano Ayrton Pucci

## Tecnologías

### Backend

| Tecnología | Propósito |
|------------|-----------|
| **NestJS** | Framework Node.js con arquitectura modular |
| **TypeScript** | Lenguaje de programación tipado |
| **Prisma ORM** | ORM para gestión de base de datos |
| **PostgreSQL** | Base de datos relacional (Supabase hosted) |
| **Zod** | Validación de esquemas y tipos |
| **JWT** | Autenticación stateless |
| **bcrypt** | Hash de contraseñas |

## Arquitectura (MVC + Services)

```
src/
├── main.ts                    # Entry point (NestFactory)
├── app.module.ts             # Módulo raíz
├── model/                    # Capa de datos (Prisma)
│   └── auth.model.ts
├── modules/                  # Módulos NestJS
│   └── auth/                 # Módulo de autenticación
│       ├── dto/              # Data Transfer Objects (Zod)
│       │   ├── register.dto.ts
│       │   └── login.dto.ts
│       ├── guards/           # Guards (JWT Auth)
│       │   └── jwt-auth.guard.ts
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       └── auth.module.ts
└── utils/                    # Utilidades
    └── hash.util.ts
```

## Objetivos del Proyecto

1. Permitir a los vendedores registrar vehículos con detalles completos
2. Ofrecer a compradores buscar y filtrar vehículos según sus preferencias
3. Proporcionar análisis automático del estado del vehículo mediante IA
4. Gestionar favoritos para usuarios compradores
5. Implementar autenticación y autorización de usuarios

## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| **Admin** | Gestiona usuarios y contenido de la plataforma |
| **Vendedor** | Publica y gestiona vehículos a la venta |
| **Comprador** | Busca, visualiza y guarda favoritos de vehículos |

## Endpoints de Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Registrar nuevo usuario | No |
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/logout` | Cerrar sesión | Sí |
| GET | `/auth/me` | Obtener usuario autenticado | Sí |

### Ejemplo de Registro
```json
POST /auth/register
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "password": "Password123",
  "role": "BUYER"
}
```

### Ejemplo de Login
```json
POST /auth/login
{
  "email": "juan@email.com",
  "password": "Password123"
}
```

### Respuesta de Login
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
```

## Roadmap

- [x] Sistema de autenticación (registro, login, logout)
- [ ] Gestión de vehículos (CRUD completo)
- [ ] Búsqueda y filtrado de vehículos
- [ ] Sistema de favoritos para compradores
- [ ] Análisis de IA del estado del vehículo
- [ ] Panel de administración

## Licencia

ISC
