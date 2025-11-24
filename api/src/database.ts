import { DataSource } from 'typeorm';
import { Report } from '@/entities/Report';
import { User } from '@/entities/User';
import * as bcrypt from '@node-rs/bcrypt';

const isDevelopment = process.env.NODE_ENV !== 'production';
const dbType = process.env.DB_TYPE || 'postgres';

// PostgreSQL configuration
const postgresConfig = {
	type: 'postgres' as const,
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '5432'),
	username: process.env.DB_USER || 'violeta',
	password: process.env.DB_PASSWORD || 'violeta123',
	database: process.env.DB_NAME || 'violeta_digital',
};

// SQLite configuration (fallback for development)
const sqliteConfig = {
	type: 'better-sqlite3' as const,
	database: process.env.DB_PATH || './data/database.sqlite',
};

export const AppDataSource = new DataSource({
	...(dbType === 'sqlite' ? sqliteConfig : postgresConfig),
	entities: [Report, User],
	synchronize: true, // Auto-create tables in development
	logging: isDevelopment,
});

export async function initializeDatabase() {
	try {
		await AppDataSource.initialize();
		console.log('✓ Database connected successfully');

		// Seed default admin if none exists
		const userRepo = AppDataSource.getRepository(User);
		const users = await userRepo.count();
		if (users === 0) {
			const username = process.env.ADMIN_USERNAME || 'admin';
			const password = process.env.ADMIN_PASSWORD || 'ChangeMe!123';
			const passwordHash = await bcrypt.hash(password);
			const admin = userRepo.create({ username, passwordHash });
			await userRepo.save(admin);
			console.log(`✓ Seeded default admin user: ${username}`);
		}
	} catch (error) {
		console.error('✗ Database connection failed:', error);
		throw error;
	}
}
