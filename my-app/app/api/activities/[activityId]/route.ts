import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ activityId: string }> }
) {
  try {
    const { activityId } = await params;

    // 1. 於資料庫查詢活動資料
    const activity = await db.activity.findUnique({
      where: { id: activityId },
    });

    // 2. 找不到對應的活動
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
