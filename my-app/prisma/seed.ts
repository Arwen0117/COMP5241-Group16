import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';

// Prisma ORM v7 needs an explicit driver adapter, same as lib/db.ts.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Copy my-app/.env.example to my-app/.env and fill in your PostgreSQL connection string.',
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  // 1. User
  const user = await prisma.user.upsert({
    where: { id: 'user-1' },
    update: {
      email: 'test@test.com',
      name: 'Test User',
      role: 'student',
    },
    create: {
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      role: 'student',
    },
  });

  // 2. Course (depends on User)
  const course = await prisma.course.upsert({
    where: { id: 'course-1' },
    update: {
      title: 'Test Course',
      instructorId: user.id,
    },
    create: {
      id: 'course-1',
      title: 'Test Course',
      instructorId: user.id,
    },
  });

  // 3. Lesson (depends on Course)
  const lesson = await prisma.lesson.upsert({
    where: { id: 'lesson-1' },
    update: {
      title: 'Lesson 1',
      content: 'Hello',
      courseId: course.id,
    },
    create: {
      id: 'lesson-1',
      title: 'Lesson 1',
      content: 'Hello',
      courseId: course.id,
    },
  });

  // 4. Activity (depends on Lesson)
  const activity = await prisma.activity.upsert({
    where: { id: 'act-1' },
    update: {
      type: 'quiz',
      content: {},
      config: {},
      lessonId: lesson.id,
    },
    create: {
      id: 'act-1',
      type: 'quiz',
      content: {},
      config: {},
      lessonId: lesson.id,
    },
  });

  console.log('Seed complete:', {
    user: user.id,
    course: course.id,
    lesson: lesson.id,
    activity: activity.id,
  });
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
