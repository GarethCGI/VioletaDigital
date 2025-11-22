import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { initializeDatabase } from '@/database';
import { createReportRoutes } from '@/routes/reports';
import { createAuthRoutes } from '@/routes/auth';

const PORT = parseInt(process.env.PORT || '3000');
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    // Create Elysia app
    const app = new Elysia()
      .use(cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      }))
      .get('/', () => ({
        message: 'Violeta Digital API',
        version: '1.0.0',
        status: 'running',
      }))
      .get('/health', () => ({
        status: 'healthy',
        timestamp: new Date().toISOString(),
      }));

    // Register routes
    createAuthRoutes(app);
    createReportRoutes(app);

    // Start server
    app.listen({
      port: PORT,
      hostname: HOST,
    });

    console.log(`✓ Server running on http://${HOST}:${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
