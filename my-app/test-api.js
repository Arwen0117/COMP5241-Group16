// POST /api/events 的煙霧測試（smoke test）。
//
// 這支 API 現在受 Auth.js 保護：
//   - 請求必須帶有登入後的 session cookie，否則會回 401 Unauthorized。
//   - body 不再需要 userId，伺服器會自動用登入者的 user.id 寫入資料庫。
//     （就算你在 body 硬塞 userId，也會被忽略。）
//
// 用法：
//   1. 啟動 dev server：              npm run dev
//   2. 用 Google 登入：               http://localhost:3000/api/auth/signin
//   3. 取得 session cookie（見下方「如何拿到 cookie」）
//   4. 執行本腳本：
//        PowerShell:  $env:SESSION_COOKIE="<貼上 cookie 值>"; node test-api.js
//        bash/zsh:    SESSION_COOKIE="<貼上 cookie 值>" node test-api.js
//        cmd.exe:     set SESSION_COOKIE=<貼上 cookie 值> && node test-api.js
//      或者直接把 cookie 當參數傳：
//        node test-api.js "<貼上 cookie 值>"
//
//   不帶 cookie 執行也很有用：可以驗證 API 真的擋得住未登入的請求（預期 401）。
//
// 如何拿到 cookie：
//   a) 瀏覽器 DevTools：登入後開 DevTools → Application → Cookies →
//      http://localhost:3000 → 複製 authjs.session-token 的 Value。
//   b) curl 存 cookie jar（見檔尾註解），再從存下來的檔案取值。

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

// Auth.js 的 session cookie 名稱：
//   - http  （localhost 開發）：authjs.session-token
//   - https （部署到正式站）：  __Secure-authjs.session-token
const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ??
  (BASE_URL.startsWith('https')
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token');

const sessionCookie = process.env.SESSION_COOKIE ?? process.argv[2] ?? '';

// 注意：這裡刻意不放 userId，驗證伺服器是否改用 session 內的使用者。
const payload = {
  activityId: 'act-1',
  score: 8,
  maxScore: 10,
  timeSpent: 120,
};

/**
 * 送出一次 POST /api/events。
 * @param {string} [cookie] session cookie 的值；不傳就是「未登入」的情境。
 */
async function postEvents(cookie) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) {
    headers.Cookie = `${SESSION_COOKIE_NAME}=${cookie}`;
  }

  const res = await fetch(`${BASE_URL}/api/events`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  return { status: res.status, statusText: res.statusText, body: await res.text() };
}

function log(label, result) {
  console.log(`--- ${label} ---`);
  console.log(`Status:   ${result.status} ${result.statusText}`);
  console.log(`Response: ${result.body}`);
  console.log('');
}

async function main() {
  console.log(`BASE_URL: ${BASE_URL}`);
  console.log(`Cookie:   ${sessionCookie ? `${SESSION_COOKIE_NAME}=<hidden>` : '(未提供)'}`);
  console.log(`Body:     ${JSON.stringify(payload)}`);
  console.log('');

  // 情境 1：未登入 → 預期 401，證明 Auth 保護有效。
  const anonymous = await postEvents();
  log('未登入（預期 401 Unauthorized）', anonymous);

  if (!sessionCookie) {
    console.log('沒有提供 SESSION_COOKIE，只測了未登入的情境。');
    console.log('請照檔案開頭的說明取得 cookie 後再執行一次，才能測到成功寫入。');
    // 未登入時拿到 401 算通過；拿到其他狀態代表保護沒生效。
    if (anonymous.status !== 401) {
      console.error('預期 401 但拿到其他狀態，請檢查 API 的 Auth 邏輯。');
      process.exitCode = 1;
    }
    return;
  }

  // 情境 2：帶 cookie → 預期 200，且回傳的 event.userId 應該是登入者（不是 payload 的值）。
  const authenticated = await postEvents(sessionCookie);
  log('已登入（預期 200 success）', authenticated);

  if (authenticated.status !== 200) {
    console.error('登入後仍失敗：cookie 可能過期／複製錯誤，或 activityId 不存在。');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Request failed:', error);
  console.error('Is the dev server running? (npm run dev)');
  process.exitCode = 1;
});

// ---------------------------------------------------------------------------
// 另一種取得 cookie 的方式：用 curl 登入流程存 cookie jar
//
// 1. 取得 CSRF token（Auth.js 需要）：
//      curl -c cookies.txt http://localhost:3000/api/auth/csrf
//    → 回應 {"csrfToken":"..."}
//
// 2. 用 Google 登入（會轉址到 Google 同意頁面）：
//      curl -b cookies.txt -c cookies.txt -X POST \
//        -d "csrfToken=<上一步的 csrfToken>" \
//        -d "callbackUrl=http://localhost:3000" \
//        http://localhost:3000/api/auth/signin/google
//
//    Google OAuth 無法在純 CLI 完成互動同意，所以實務上通常在瀏覽器登入一次，
//    再把 DevTools 裡的 authjs.session-token 值複製出來（見檔案開頭作法 a）。
//
// 3. 有了 cookie 值後，也可以直接用 curl 打這支 API：
//      curl -X POST http://localhost:3000/api/events \
//        -H "Content-Type: application/json" \
//        -H "Cookie: authjs.session-token=<cookie 值>" \
//        -d '{"activityId":"act-1","score":8,"maxScore":10,"timeSpent":120}'
// ---------------------------------------------------------------------------
