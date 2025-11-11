// src/lib/api.js

// 1) BASE 일원화: 끝 슬래시 제거해 //api 방지
const RAW = import.meta.env.VITE_API_BASE_URL || "";
export const BASE = RAW.replace(/\/+$/, "");

// 개발 중에만 디버그 로그
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log("[AIMUSE] API BASE =", BASE);
}

// 내부 공통: URL 안전 조립
function joinUrl(path) {
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

// 내부 공통: 에러 객체 표준화
async function ensureOk(res) {
  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const payload = ct.includes("application/json")
      ? await res.json().catch(() => ({}))
      : await res.text().catch(() => "");
    const message =
      typeof payload === "string" ? payload : payload?.message || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return res;
}

/** JSON 응답용 POST */
export async function postJSON(path, data, opts = {}) {
  const res = await fetch(joinUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(opts.headers || {}),
    },
    body: JSON.stringify(data),
  });
  await ensureOk(res);

  // 204 같은 케이스 대비
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return await res.text();
  return res.json();
}

/** 문자열(텍스트) 응답용 — 로그인 토큰 받는 데 사용 */
export async function postText(path, data, opts = {}) {
  const res = await fetch(joinUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
       "ngrok-skip-browser-warning": "true",
      ...(opts.headers || {}),
    },
    body: JSON.stringify(data),
  });
  await ensureOk(res);
  return res.text();
}

/** 인증 필요 API 호출용 — Bearer 토큰 자동 첨부 */
export async function authFetch(path, options = {}) {
  const url = joinUrl(path);

  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});
  // 토큰이 있을 때만 Authorization 부여(★ Bearer null 방지)
  if (token) headers.set("Authorization", `Bearer ${token}`);
  headers.set("ngrok-skip-browser-warning", "true");
  const res = await fetch(url, { ...options, headers });

  try {
    await ensureOk(res);
  } catch (err) {
    // 401이면 선택적으로 세션 정리(자동 로그아웃 정책 유지)
    if (err.status === 401) {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    }
    throw err;
  }
  return res;
}
