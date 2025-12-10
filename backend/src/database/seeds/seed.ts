import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { seedPlantSpecies } from './plant-species.seed';

// Load environment variables
config({ path: join(__dirname, '../../../.env') });

// Support both DATABASE_URL (Railway/production) and individual variables (local)
const dataSourceConfig = process.env.DATABASE_URL
  ? {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
      entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }
  : {
      type: 'postgres' as const,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'drplantes',
      entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
      synchronize: false,
    };

const AppDataSource = new DataSource(dataSourceConfig);

async function runSeeds() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connection established.');

    console.log('Running seeds...');
    await seedPlantSpecies(AppDataSource);

    console.log('All seeds completed successfully!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

runSeeds();
