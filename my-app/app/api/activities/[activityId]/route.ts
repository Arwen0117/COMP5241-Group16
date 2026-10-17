import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { activityId: string } }
) {
  try {
    const activityId = params.activityId;

    // 1. 於資料庫查詢活動資料（目前使用模擬資料）
    const mockActivity = {
      id: activityId,
      type: 'quiz',
      content: [
        {
          question: 'useState 返回什麼？',
          options: ['一個數字', '一個數組', '一個函數', '一個 Promise'],
          correctAnswerIndex: 1,
        },
      ],
      config: { timeLimit: 60 },
    };

    return NextResponse.json(mockActivity);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}