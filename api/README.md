# Violeta Digital API

REST API for the Violeta Digital report management system.

## Features

- 📝 Report submission with validation
- 🗃️ PostgreSQL database with TypeORM
- 🔒 Rate limiting protection
- ✅ Zod schema validation
- 🐳 Docker & Docker Compose support
- 🚀 Built with Bun and Elysia

## Prerequisites

- [Bun](https://bun.sh) >= 1.0
- PostgreSQL 16+ (or use Docker Compose)
- Docker & Docker Compose (optional)

## Quick Start

### Using Docker Compose (Recommended)

1. From the project root, run:
```bash
docker-compose up -d
```

This will start both PostgreSQL and the API service.

The API will be available at `http://localhost:3000`

### Local Development

1. Install dependencies:
```bash
cd api
bun install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Configure your database in `.env`:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=violeta
DB_PASSWORD=violeta123
DB_NAME=violeta_digital
```

Or use SQLite for development:
```env
DB_TYPE=sqlite
DB_PATH=./data/database.sqlite
```

4. Start the development server:
```bash
bun run dev
```

## API Endpoints

### Health Check
```
GET /health
```

### Create Report
```
POST /api/reports
Content-Type: application/json

{
  "role": "Docente",
  "type": "Violencia",
  "description": "Descripción detallada del incidente...",
  "location": "Aula 302",
  "date": "2025-11-22",
  "witnesses": "Juan Pérez, María López",
  "additionalInfo": "Información adicional..."
}
```

### List Reports
```
GET /api/reports?page=1&limit=10&role=Docente&type=Violencia
```

### Get Report by ID
```
GET /api/reports/:id
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Default: 10 requests per minute per IP
- Configurable via `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW` environment variables

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when the limit resets

## Database Schema

The `reports` table includes:
- `id` (UUID, Primary Key)
- `role` (varchar) - Reporter role
- `type` (varchar) - Report type
- `description` (text) - Incident description
- `location` (varchar, nullable) - Incident location
- `date` (varchar, nullable) - Incident date
- `witnesses` (text, nullable) - Witnesses information
- `additionalInfo` (text, nullable) - Additional details
- `createdAt` (timestamp) - Creation timestamp
- `updatedAt` (timestamp) - Last update timestamp

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `HOST` | Server host | `0.0.0.0` |
| `DB_TYPE` | Database type (`postgres` or `sqlite`) | `postgres` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL user | `violeta` |
| `DB_PASSWORD` | PostgreSQL password | `violeta123` |
| `DB_NAME` | PostgreSQL database name | `violeta_digital` |
| `DB_PATH` | SQLite database path (if using SQLite) | `./data/database.sqlite` |
| `CORS_ORIGIN` | CORS allowed origins | `*` |
| `RATE_LIMIT_MAX` | Max requests per window | `10` |
| `RATE_LIMIT_WINDOW` | Rate limit window in ms | `60000` |

## Development Commands

```bash
# Start development server with hot reload
bun run dev

# Start production server
bun run start

# TypeORM CLI
bun run typeorm <command>
```

## Production Deployment

### Docker Compose

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Standalone Docker

```bash
cd api
docker build -t violeta-api .
docker run -p 3000:3000 --env-file .env violeta-api
```

## License

MIT
