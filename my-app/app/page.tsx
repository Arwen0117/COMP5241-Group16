"use client";

import { useState, useEffect } from "react";

// 1. 定義題目格式（之後可以由 AI 生成）
const MOCK_QUESTIONS = [
  {
    question: "useState 返回什麼？",
    options: ["一個數字", "一個數組", "一個函數", "一個 Promise"],
    correctAnswerIndex: 1,
  },
  {
    question: "useEffect 的依賴陣列為空 [] 時，會在何時執行？",
    options: ["每次渲染", "僅第一次渲染後", "永遠不執行", "每次更新後"],
    correctAnswerIndex: 1,
  },
];

export default function QuizGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 秒倒數
  const [isFinished, setIsFinished] = useState(false);

  // 2. 倒數計時器邏輯
  useEffect(() => {
    if (isFinished) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  // 3. 處理點擊答案
  const handleAnswer = (index: number) => {
    if (index === MOCK_QUESTIONS[currentIndex].correctAnswerIndex) {
      setScore(score + 1);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < MOCK_QUESTIONS.length) {
      setCurrentIndex(nextIndex);
    } else {
      setIsFinished(true);
    }
  };

  // 4. 如果遊戲結束，顯示結果
  if (isFinished) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">測驗結束！</h2>
        <p className="text-lg mb-6">
          你答對了 <span className="text-blue-600 font-bold text-3xl">{score}</span> / {MOCK_QUESTIONS.length} 題
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setScore(0);
            setTimeLeft(30);
            setIsFinished(false);
          }}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          再玩一次
        </button>
      </div>
    );
  }

  // 5. 遊戲進行中 UI
  const currentQ = MOCK_QUESTIONS[currentIndex];

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto mt-10">
      {/* 頂部：進度與時間 */}
      <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
        <span>題目 {currentIndex + 1} / {MOCK_QUESTIONS.length}</span>
        <span className="font-mono text-red-500">⏱ {timeLeft}s</span>
      </div>

      {/* 題目 */}
      <h2 className="text-xl font-bold mb-6">{currentQ.question}</h2>

      {/* 選項按鈕 */}
      <div className="flex flex-col gap-3">
        {currentQ.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className="text-left px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}