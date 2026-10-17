import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

// Prisma ORM v7 requires an explicit driver adapter (here: node-postgres).
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Copy my-app/.env.example to my-app/.env and fill in your PostgreSQL connection string.',
  );
}

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

// Next.js dev mode reloads modules on every change; keep a single client
// (and therefore a single connection pool) on the global object.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// `db` is the alias the API routes under app/api already reference.
export const db = prisma;

export default prisma;
