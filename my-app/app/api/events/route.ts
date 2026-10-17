import { NextResponse } from 'next/server';
// import { auth } from '@/auth'; // 稍後接上認證功能後啟用
// import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // 1. 取得登入資料（目前使用模擬資料）
    // const session = await auth();
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. 接收前端傳送的 JSON 資料
    const body = await request.json();
    const { activityId, score, maxScore, timeSpent } = body;

    if (!activityId) {
      return NextResponse.json({ error: 'Missing activityId' }, { status: 400 });
    }

    // 3. 將資料存入資料庫（目前為模擬實作）
    console.log('收到活動分數:', { activityId, score, maxScore, timeSpent });

    // 4. 回傳成功狀態
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}