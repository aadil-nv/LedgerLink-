// backend/src/config/env.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  MONGO_URI: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
}

function parseNumber(value: string | undefined, name: string): number {
  if (!value) throw new Error(`Missing env var ${name}`);
  const num = Number(value);
  if (Number.isNaN(num)) throw new Error(`Invalid number for env var ${name}`);
  return num;
}

function getEnv(): EnvConfig {
  const {
    NODE_ENV,
    PORT,
    MONGO_URI,
    REDIS_URL,
    JWT_SECRET,
    RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX,
  } = process.env;

  if (!NODE_ENV) throw new Error('NODE_ENV is required');
  if (!MONGO_URI) throw new Error('MONGO_URI is required');
  if (!REDIS_URL) throw new Error('REDIS_URL is required');
  if (!JWT_SECRET) throw new Error('JWT_SECRET is required');

  return {
    NODE_ENV: NODE_ENV === 'production' ? 'production' : NODE_ENV === 'test' ? 'test' : 'development',
    PORT: parseNumber(PORT, 'PORT'),
    MONGO_URI,
    REDIS_URL,
    JWT_SECRET,
    RATE_LIMIT_WINDOW_MS: parseNumber(RATE_LIMIT_WINDOW_MS ?? '60000', 'RATE_LIMIT_WINDOW_MS'),
    RATE_LIMIT_MAX: parseNumber(RATE_LIMIT_MAX ?? '1000', 'RATE_LIMIT_MAX'),
  };
}

export const config = getEnv();
