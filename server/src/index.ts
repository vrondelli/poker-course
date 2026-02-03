import Fastify from 'fastify';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './infra/db/schema';
import dotenv from 'dotenv';
import cors from '@fastify/cors';

dotenv.config(); // Load .env

const fastify = Fastify({ logger: true });

// DB Connection
const connectionString = process.env.DATABASE_URL || 'postgres://poker:password@localhost:5432/poker_trainer';
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

fastify.register(cors, { 
  origin: true // Allow all for dev
});

// Health check
fastify.get('/health', async () => {
  return { status: 'ok' };
});

import { gameRoutes } from './interface/routes';

// ...

// Routes
fastify.register(gameRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
