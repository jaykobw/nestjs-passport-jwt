import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  driver: process.env.DB_DRIVER,
  host: process.env.DB_HOST,
  databaseName: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  sync: process.env.DATABASE_SYNC,
  autoload: process.env.DATABASE_AUTOLOAD,
  logging: process.env.DATABASE_LOGGING,
}));
