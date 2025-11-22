# Violeta Digital - Report Management System

A complete report submission system with a Vue/Tauri mobile application and a backend API service.

## Project Structure

```
.
├── app_movil/              # Tauri + Vue.js mobile application
│   ├── src/
│   │   ├── views/
│   │   │   ├── HomeView.vue          # Role selection
│   │   │   ├── ReportTypeView.vue    # Type selection
│   │   │   └── ReportFormView.vue    # Report form
│   │   ├── composables/
│   │   │   └── useReport.ts          # API integration
│   │   └── types/
│   │       └── report.ts             # TypeScript types
│   └── src-tauri/          # Tauri Rust backend
├── api/                    # Backend API service
│   ├── src/
│   │   ├── entities/       # TypeORM entities
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Rate limiting
│   │   └── index.ts        # Server entry point
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml      # Docker orchestration
```

## Features

### Frontend (app_movil)
- 📱 Cross-platform mobile app (iOS, Android) with Tauri
- 🎨 Modern UI with Tailwind CSS and shadcn-vue components
- 🔐 Privacy-focused report submission
- ✅ Form validation
- 🌐 API integration with Tauri HTTP plugin

### Backend (api)
- 🚀 High-performance API with Bun and Elysia
- 🗃️ PostgreSQL database with TypeORM
- ✅ Zod schema validation
- 🔒 Rate limiting (10 requests/minute per IP)
- 🐳 Docker support with PostgreSQL
- 📊 Pagination and filtering

## Quick Start

### Using Docker Compose (Recommended)

Start both the API and PostgreSQL database:

```bash
docker-compose up -d
```

The API will be available at `http://localhost:3000`

### Backend API (Local Development)

```bash
cd api
bun install
cp .env.example .env
# Edit .env for your database configuration
bun run dev
```

See [api/README.md](api/README.md) for detailed backend documentation.

### Frontend Mobile App

```bash
cd app_movil
npm install  # or bun install
npm run tauri dev
```

## API Endpoints

### Create Report
```bash
POST http://localhost:3000/api/reports
Content-Type: application/json

{
  "role": "Docente",
  "type": "Violencia",
  "description": "Descripción detallada del incidente (mínimo 20 caracteres)...",
  "location": "Aula 302",
  "date": "2025-11-22",
  "witnesses": "Juan Pérez, María López",
  "additionalInfo": "Información adicional..."
}
```

### List Reports
```bash
GET http://localhost:3000/api/reports?page=1&limit=10
```

### Get Report by ID
```bash
GET http://localhost:3000/api/reports/:id
```

### Health Check
```bash
GET http://localhost:3000/health
```

## Report Types

### Roles
- Docente
- Alumno
- Autoridad Educativa
- PAAE
- Otro

### Types
- Violencia
- Acoso
- Discriminación

## Database

The system uses PostgreSQL by default, with SQLite as an optional fallback for development.

### PostgreSQL Schema

Table: `reports`
- `id` (UUID) - Primary key
- `role` (VARCHAR) - Reporter role
- `type` (VARCHAR) - Report type
- `description` (TEXT) - Incident description (required, min 20 chars)
- `location` (VARCHAR) - Incident location (optional)
- `date` (VARCHAR) - Incident date (optional)
- `witnesses` (TEXT) - Witnesses information (optional)
- `additionalInfo` (TEXT) - Additional details (optional)
- `createdAt` (TIMESTAMP) - Creation timestamp
- `updatedAt` (TIMESTAMP) - Last update timestamp

## Configuration

### Backend Environment Variables

Create `api/.env`:

```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=violeta
DB_PASSWORD=violeta123
DB_NAME=violeta_digital

# Server Configuration
PORT=3000
HOST=0.0.0.0

# CORS Configuration
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW=60000
```

### Frontend Configuration

The frontend automatically connects to `http://localhost:3000` by default. To change this, set the environment variable:

```env
VITE_API_URL=http://your-api-url:3000
```

## Development

### Backend

```bash
cd api
bun run dev    # Start with hot reload
```

### Frontend

```bash
cd app_movil
npm run dev    # Web development
npm run tauri dev    # Tauri mobile development
```

## Building for Production

### Backend Docker Image

```bash
cd api
docker build -t violeta-api .
```

### Frontend Mobile App

```bash
cd app_movil
npm run tauri build
```

This will generate Android APK and/or iOS IPA files.

## Security Features

- 🔒 Rate limiting (10 requests per minute per IP)
- ✅ Input validation with Zod schemas
- 🛡️ CORS configuration
- 🔐 Privacy-focused design

## Technology Stack

### Frontend
- Vue 3 (Composition API)
- Tauri 2.x
- TypeScript
- Tailwind CSS
- shadcn-vue components
- Vite

### Backend
- Bun runtime
- Elysia web framework
- TypeORM
- PostgreSQL / SQLite
- Zod validation
- Docker

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
