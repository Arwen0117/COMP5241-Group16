import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    // 1. 於資料庫查詢課程內容（目前使用模擬資料）
    const mockLesson = {
      id: lessonId,
      title: 'React Hooks 入門',
      content: 'Hooks 可讓您在 Function Component 中使用 State...',
      sourceReference: 'react_basics.pdf 第 3 頁',
    };

    return NextResponse.json(mockLesson);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}