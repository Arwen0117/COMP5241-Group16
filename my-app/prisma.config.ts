import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Where the schema lives, and where migrations are generated
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // Run with `npm run db:seed`. jiti executes the TypeScript seed script
    // (the generated Prisma client uses extensionless imports that plain
    // `node` cannot resolve).
    seed: 'jiti prisma/seed.ts',
  },
  // Prisma CLI connection (used by migrate / db push / studio).
  // The app itself connects through the driver adapter in lib/db.ts.
  datasource: {
    url: env('DATABASE_URL'),
  },
});
