import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: Request) {
  try {
    // 1. 取得 URL 查詢參數（例如 ?courseId=123&userId=abc）
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const userId = searchParams.get('userId');

    // 2. 建立 Event 的查詢條件：可依課程與學習者篩選
    const where = {
      ...(userId ? { userId } : {}),
      ...(courseId ? { activity: { lesson: { courseId } } } : {}),
    };

    // 3. 以 aggregate 計算平均分數（未評分的活動 score 為 null，會自動被忽略）
    const scoreAggregate = await db.event.aggregate({
      where,
      _avg: { score: true },
    });

    // 4. 以 findMany 取得實際完成的活動（以 activityId 去重）
    const completedEvents = await db.event.findMany({
      where,
      select: { activityId: true },
      distinct: ['activityId'],
    });

    // 5. 取得該課程（或全部課程）的活動總數，換算學習進度百分比
    const totalActivities = await db.activity.count({
      where: courseId ? { lesson: { courseId } } : undefined,
    });

    const progressPercent =
      totalActivities > 0
        ? Math.round((completedEvents.length / totalActivities) * 100)
        : 0;
    const averageScore = Math.round(scoreAggregate._avg.score ?? 0);

    // 6. 回傳 JSON 資料
    return NextResponse.json({ progressPercent, averageScore });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
