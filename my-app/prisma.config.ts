import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Where the schema lives, and where migrations are generated
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // Prisma CLI connection (used by migrate / db push / studio).
  // The app itself connects through the driver adapter in lib/db.ts.
  datasource: {
    url: env('DATABASE_URL'),
  },
});
