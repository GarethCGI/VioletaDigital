import { Elysia } from 'elysia';
import { AppDataSource } from '@/database';
import { Report } from '@/entities/Report';
import { createReportSchema, listReportsQuerySchema } from '@/schemas/report.schema';
import { createRateLimiter } from '@/middleware/rateLimiter';
import { authMiddleware } from '@/middleware/auth';

// Create rate limiter instance
const rateLimiter = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_MAX || '10'),
  parseInt(process.env.RATE_LIMIT_WINDOW || '60000')
);

export function createReportRoutes(app: Elysia) {
  const reportRepository = AppDataSource.getRepository(Report);

  return app.group('/api/reports', (app) =>
    app
      // Rate limiting middleware
      .derive(({ request, set }) => {
        // Get IP from request (for rate limiting)
        const ip = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';

        const { allowed, remaining, resetTime } = rateLimiter.check(ip);

        // Add rate limit headers
        set.headers['X-RateLimit-Limit'] = process.env.RATE_LIMIT_MAX || '10';
        set.headers['X-RateLimit-Remaining'] = remaining.toString();
        set.headers['X-RateLimit-Reset'] = Math.ceil(resetTime / 1000).toString();

        if (!allowed) {
          set.status = 429;
          throw new Error('Demasiadas solicitudes. Por favor, intenta más tarde.');
        }

        return {};
      })

      // POST /api/reports - Create a new report (public)
      .post('/', async ({ body, set }) => {
        try {
          // Validate input
          const validatedData = createReportSchema.parse(body);

          // Create and save report
          const report = reportRepository.create(validatedData);
          const savedReport = await reportRepository.save(report);

          set.status = 201;
          return {
            success: true,
            data: savedReport,
            message: 'Reporte creado exitosamente',
          };
        } catch (error) {
          console.error('Error creating report:', error);
          
          // Handle Zod validation errors
          if (error && typeof error === 'object' && 'issues' in error) {
            set.status = 400;
            return {
              success: false,
              error: 'Datos de entrada inválidos',
              details: error,
            };
          }

          set.status = 500;
          return {
            success: false,
            error: 'Error al crear el reporte',
          };
        }
      })

      // Protected subgroup for read endpoints
      .group('', (protectedApp) =>
        protectedApp
          .use(authMiddleware)
          // GET /api/reports - List reports with pagination (protected)
          .get('/', async ({ query, set }) => {
        try {
          // Validate and parse query params
          const { page, limit, role, type } = listReportsQuerySchema.parse(query);

          // Build query
              const queryBuilder = reportRepository.createQueryBuilder('report');

          if (role) {
            queryBuilder.andWhere('report.role = :role', { role });
          }

          if (type) {
            queryBuilder.andWhere('report.type = :type', { type });
          }

          // Count total
          const total = await queryBuilder.getCount();

          // Apply pagination
          const reports = await queryBuilder
            .orderBy('report.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

          return {
            success: true,
            data: reports,
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit),
            },
          };
        } catch (error) {
          console.error('Error fetching reports:', error);
          
          set.status = 500;
          return {
            success: false,
            error: 'Error al obtener los reportes',
          };
        }
          })

          // GET /api/reports/:id - Get single report by ID (protected)
          .get('/:id', async ({ params, set }) => {
            try {
              const report = await reportRepository.findOne({
                where: { id: params.id },
              });

              if (!report) {
                set.status = 404;
                return {
                  success: false,
                  error: 'Reporte no encontrado',
                };
              }

              return {
                success: true,
                data: report,
              };
            } catch (error) {
              console.error('Error fetching report:', error);
              
              set.status = 500;
              return {
                success: false,
                error: 'Error al obtener el reporte',
              };
            }
          })

          // GET /api/reports/stats - Aggregated statistics (protected)
          .get('/stats', async ({ query, set }) => {
            try {
              // period: daily | weekly | monthly | yearly
              const periodRaw = (query?.period as string) || 'daily';
              const period = ['daily', 'weekly', 'monthly', 'yearly'].includes(periodRaw)
                ? (periodRaw as 'daily' | 'weekly' | 'monthly' | 'yearly')
                : 'daily';

              const type = AppDataSource.options.type;

              // Time series
              let timeQuery = reportRepository.createQueryBuilder('report');
              if (type === 'postgres') {
                const truncUnit = period === 'daily' ? 'day' : period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'year';
                timeQuery = timeQuery
                  .select(`date_trunc('${truncUnit}', report."createdAt")`, 'bucket')
                  .addSelect('COUNT(*)', 'count')
                  .groupBy('bucket')
                  .orderBy('bucket', 'ASC');
              } else {
                // sqlite
                const fmt = period === 'daily' ? '%Y-%m-%d' : period === 'weekly' ? '%Y-%W' : period === 'monthly' ? '%Y-%m' : '%Y';
                timeQuery = timeQuery
                  .select(`strftime('${fmt}', report.createdAt)`, 'bucket')
                  .addSelect('COUNT(*)', 'count')
                  .groupBy('bucket')
                  .orderBy('bucket', 'ASC');
              }

              const timeRaw = await timeQuery.getRawMany<{ bucket: string; count: string }>();
              const timeSeries = timeRaw.map(r => ({ bucket: r.bucket, count: Number(r.count) }));

              // Distribution by type
              const byType = await reportRepository.createQueryBuilder('report')
                .select('report.type', 'type')
                .addSelect('COUNT(*)', 'count')
                .groupBy('report.type')
                .orderBy('count', 'DESC')
                .getRawMany<{ type: string; count: string }>();

              // Distribution by role
              const byRole = await reportRepository.createQueryBuilder('report')
                .select('report.role', 'role')
                .addSelect('COUNT(*)', 'count')
                .groupBy('report.role')
                .orderBy('count', 'DESC')
                .getRawMany<{ role: string; count: string }>();

              const total = await reportRepository.count();

              return {
                success: true,
                data: {
                  period,
                  total,
                  timeSeries,
                  typeDistribution: byType.map(x => ({ type: x.type, count: Number(x.count) })),
                  roleDistribution: byRole.map(x => ({ role: x.role, count: Number(x.count) })),
                },
              };
            } catch (error) {
              console.error('Error fetching stats:', error);
              set.status = 500;
              return { success: false, error: 'Error al obtener estadísticas' };
            }
          })
      )
  );
}
