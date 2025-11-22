# Quick Start Guide - Violeta Digital

This guide will help you get the Violeta Digital report system up and running quickly.

## Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Docker](https://www.docker.com/) and Docker Compose v2
- [Node.js](https://nodejs.org/) >= 18 (for frontend)

## Step 1: Start the Backend API

### Option A: Using Docker Compose (Recommended)

Start both the API and PostgreSQL database:

```bash
cd /home/root/dev/Git_/GaryCraft/VioletaDigital
docker compose up -d
```

Check the logs:
```bash
docker compose logs -f api
```

The API will be available at `http://localhost:3000`

### Option B: Local Development

1. Start only PostgreSQL:
```bash
docker compose up -d postgres
```

2. Install API dependencies and start:
```bash
cd api
bun install
cp .env.example .env
# Edit .env if needed
bun run dev
```

## Step 2: Verify API is Running

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

You should see:
```json
{"status":"healthy","timestamp":"2025-11-23T..."}
```

Test the root endpoint:
```bash
curl http://localhost:3000/
```

You should see:
```json
{"message":"Violeta Digital API","version":"1.0.0","status":"running"}
```

## Step 3: Test Creating a Report

```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Docente",
    "type": "Violencia",
    "description": "Este es un reporte de prueba con más de 20 caracteres",
    "location": "Aula 302",
    "date": "2025-11-22"
  }'
```

## Step 4: Start the Frontend App

```bash
cd app_movil
npm install  # or bun install
npm run tauri dev
```

This will open the Tauri application where you can:
1. Select your role (Docente, Alumno, etc.)
2. Choose report type (Violencia, Acoso, Discriminación)
3. Fill out the report form
4. Submit the report

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| POST | `/api/reports` | Create a new report |
| GET | `/api/reports` | List all reports (paginated) |
| GET | `/api/reports/:id` | Get a specific report |

## Testing Rate Limiting

The API limits requests to 10 per minute per IP. Test it:

```bash
for i in {1..12}; do
  curl -s -o /dev/null -w "Request $i: %{http_code}\n" \
    http://localhost:3000/api/reports
done
```

You should see the first 8-10 requests succeed (200), then rate limiting kicks in (429).

## Stopping the Services

### Stop all Docker services:
```bash
docker compose down
```

### Stop and remove data:
```bash
docker compose down -v
```

### Stop the frontend:
Press `Ctrl+C` in the terminal running `npm run tauri dev`

## Troubleshooting

### PostgreSQL connection failed
Make sure PostgreSQL is running:
```bash
docker compose ps
docker compose logs postgres
```

### Port 3000 already in use
Check what's using the port:
```bash
lsof -i :3000
```

Kill the process or change the port in `api/.env`:
```env
PORT=3001
```

### Frontend can't connect to API
1. Make sure the API is running: `curl http://localhost:3000/health`
2. Check Tauri capabilities in `app_movil/src-tauri/capabilities/default.json`
3. Check the API URL in frontend: it defaults to `http://localhost:3000`

## Next Steps

- Read the full [README.md](README.md) for detailed information
- Check [api/README.md](api/README.md) for API documentation
- Explore the code in `app_movil/src/views/` to understand the frontend flow

## Database Access

### View reports in PostgreSQL:
```bash
docker compose exec postgres psql -U violeta -d violeta_digital

# Inside psql:
SELECT * FROM reports;
\q  # to exit
```

### Reset database:
```bash
docker compose down -v
docker compose up -d
```

This will create a fresh database.
