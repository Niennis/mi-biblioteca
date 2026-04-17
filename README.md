# Mi Biblioteca

App fullstack para gestionar tu biblioteca personal de libros. Busca libros en Google Books y Open Library, agrégalos a tu colección, llevaun seguimiento de tu progreso de lectura y califica lo que hayas leído.

## Demo

[Ver aplicación en vivo](https://mi-biblioteca-web.vercel.app)

### Acceso de prueba

| Campo | Valor |
|---|---|
| Email | `demo@mibiblioteca.dev` |
| Contraseña | `demo1234` |

## Funcionalidades

- Registro e inicio de sesión con email y contraseña (Supabase Auth)
- Búsqueda de libros vía Google Books API y Open Library API
- Filtro de idioma en los resultados de búsqueda
- Agregar libros a tu biblioteca personal
- Marcar estado de lectura: por leer, leyendo, leído
- Calificar libros con estrellas (1–5)
- Marcar libros como favoritos
- Subir imagen de portada personalizada desde el dispositivo
- Editar y eliminar entradas de tu biblioteca
- Filtrar y ordenar la biblioteca por estado, título o rating
- Paginación en resultados de búsqueda
- Vista de perfil de usuario

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite 6 + TypeScript |
| Routing | React Router DOM v7 |
| Estilos | Tailwind CSS v4 |
| Backend | Express + TypeScript |
| Validación | Zod |
| ORM | Prisma 6 |
| Base de datos | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| APIs externas | Google Books API, Open Library API |
| Tests | Vitest + React Testing Library |
| Deploy | Vercel (frontend + backend) |

## Tests

```bash
# Correr tests (frontend o backend)
npm test

# Modo watch
npm run test:watch

# Con cobertura
npm run test:coverage
```

**Cobertura:**

- `api`: middleware de auth, manejo de errores, formato de respuestas, validadores, servicios de biblioteca y perfil
- `web`: componentes UI (Button, Input, PasswordInput), formularios de auth (LoginForm, RegisterForm), hooks (useBookSearch, useLibrary), utilidades de fecha

## Estructura del proyecto

```
mi-biblioteca/
├── api/                        # Backend Express + Prisma
│   ├── src/
│   │   ├── config/             # Variables de entorno validadas
│   │   ├── controllers/        # auth, books, library, profile
│   │   ├── middleware/         # auth (JWT Supabase), errorHandler
│   │   ├── routes/             # auth, books, library, profile
│   │   ├── services/           # bookSearch, googleBooks, openLibrary, library, profile
│   │   ├── types/
│   │   └── utils/              # apiResponse, validators
│   └── prisma/                 # Schema y migraciones
└── web/                        # Frontend React + Vite
    └── src/
        ├── components/
        │   ├── auth/           # LoginForm, RegisterForm, ProtectedRoute
        │   ├── books/          # BookCard, SearchBar, SearchResults, LanguageBadge
        │   ├── library/        # LibraryBookCard, LibraryGrid, FilterBar, ImageUpload
        │   └── ui/             # Button, Input, Modal, Badge, Spinner, StarRating, StatusSelect
        ├── context/            # AuthContext
        ├── hooks/              # useAuth, useBookSearch, useLibrary, useImageUpload
        ├── pages/              # LoginPage, RegisterPage, SearchPage, LibraryPage, BookDetailPage, ProfilePage
        ├── services/           # api, books.api, library.api, storage
        ├── types/
        └── utils/              # date
```

## Cómo correr localmente

### Requisitos previos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) con:
  - Auth habilitado (Email/Password)
  - Storage bucket llamado `book-images`

### Variables de entorno

Copiar `.env.example` a `.env` en cada carpeta y completar con tus credenciales:

```bash
# api/.env
PORT=3001
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
SUPABASE_URL=https://[ref].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
FRONTEND_URL=http://localhost:5173

# web/.env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://[ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Instalar y correr

```bash
# Instalar dependencias
cd api && npm install
cd ../web && npm install

# Migrar base de datos
cd api && npx prisma migrate dev

# Correr en dos terminales
cd api && npm run dev     # http://localhost:3001
cd web && npm run dev     # http://localhost:5173
```

## Desarrollado por

[Estefanía Osses Vera](https://github.com/Niennis) — Proyecto personal, 2025
