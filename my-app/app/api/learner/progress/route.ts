import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 1. 取得 URL 查詢參數（例如 ?courseId=123）
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    // 2. 於資料庫計算學習進度（目前使用模擬資料）
    const mockProgress = {
      progressPercent: 40,
      averageScore: 85,
    };

    // 3. 回傳 JSON 資料
    return NextResponse.json(mockProgress);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}