import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { getCurrentUser } from '../../../lib/getCurrentUser';

export async function POST(request: Request) {
  try {
    // 1. 檢查登入狀態：由 Auth.js session 取得目前使用者
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. 接收前端傳送的 JSON 資料（不再接收 userId，一律以登入者為準）
    const body = await request.json();
    const { activityId, score, maxScore, timeSpent } = body;

    if (!activityId) {
      return NextResponse.json({ error: 'Missing activityId' }, { status: 400 });
    }

    // 3. 寫入資料庫：userId 強制使用登入者的 user.id
    const event = await db.event.create({
      data: {
        userId: user.id,
        activityId,
        score: typeof score === 'number' ? score : null,
        maxScore: typeof maxScore === 'number' ? maxScore : null,
        timeSpent: typeof timeSpent === 'number' ? timeSpent : 0,
      },
    });

    // 4. 回傳成功狀態
    return NextResponse.json({ success: true, event });
  } catch (error) {
    // 外鍵約束錯誤：找不到對應的 activity
    const err = error as { code?: string };
    if (err?.code === 'P2003') {
      return NextResponse.json({ error: 'Invalid activityId' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
