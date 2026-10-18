import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    // 1. 於資料庫查詢課程內容
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    // 2. 找不到對應的課程內容
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
