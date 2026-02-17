# Mi Biblioteca

App web para gestionar una biblioteca personal de libros.

## Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **API**: Express + TypeScript + Prisma
- **Base de datos**: Supabase (PostgreSQL + Auth + Storage)

## Setup

### Requisitos previos

1. Node.js 18+
2. Proyecto en Supabase con Auth (Email/Password) y Storage bucket `book-images`

### Variables de entorno

Copiar `.env.example` a `.env` en `api/` y `web/`, y completar con las credenciales de Supabase.

### Instalar dependencias

```bash
cd api && npm install
cd ../web && npm install
```

### Migrar base de datos

```bash
cd api && npx prisma migrate dev
```

### Ejecutar

```bash
# Terminal 1 - API
cd api && npm run dev

# Terminal 2 - Frontend
cd web && npm run dev
```

API: http://localhost:3001
Frontend: http://localhost:5173
