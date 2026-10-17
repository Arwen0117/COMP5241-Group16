import { NextResponse } from 'next/server';
// import { auth } from '@/auth'; // 稍後接上認證功能後啟用
import { db } from '../../../lib/db';

export async function POST(request: Request) {
  try {
    // 1. 取得登入資料（目前使用模擬資料）
    // const session = await auth();
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // const userId = session.user.id;

    // 2. 接收前端傳送的 JSON 資料
    const body = await request.json();
    const { userId, activityId, score, timeSpent } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (!activityId) {
      return NextResponse.json({ error: 'Missing activityId' }, { status: 400 });
    }

    // 3. 將資料寫入資料庫（Event 需關聯到 user 與 activity）
    const event = await db.event.create({
      data: {
        userId,
        activityId,
        score: typeof score === 'number' ? score : null,
        timeSpent: typeof timeSpent === 'number' ? timeSpent : 0,
      },
    });

    // 4. 回傳成功狀態
    return NextResponse.json({ success: true, event });
  } catch (error) {
    // 外鍵約束錯誤：找不到對應的 user 或 activity
    const err = error as { code?: string };
    if (err?.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid userId or activityId' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
