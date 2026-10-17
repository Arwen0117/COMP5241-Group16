// Smoke test for POST /api/events.
//
// 1. Start the dev server:  npm run dev
// 2. Run this script:       node test-api.js

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

const payload = {
  userId: 'user-1',
  activityId: 'act-1',
  score: 8,
  maxScore: 10,
  timeSpent: 120,
};

async function main() {
  const url = `${BASE_URL}/api/events`;
  console.log(`POST ${url}`);
  console.log('Body:', JSON.stringify(payload));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log('Response:', text);

    if (!res.ok) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Request failed:', error);
    console.error('Is the dev server running? (npm run dev)');
    process.exitCode = 1;
  }
}

main();
