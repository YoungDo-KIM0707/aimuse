// src/lib/api.js
// BASE: .env가 없으면 "", 있으면 절대 URL (ngrok /aimuse-server/api)
const RAW_BASE = import.meta.env.VITE_API_BASE_URL || "";
const BASE = RAW_BASE.replace(/\/+$/, ""); // 끝 슬래시 제거

console.log("[AIMUSE] API BASE =", BASE);

// 경로 조립
function buildURL(path) {
  let p = path.startsWith("/") ? path : `/${path}`;
  if (BASE.endsWith("/api") && p.startsWith("/api/")) {
    p = p.replace(/^\/api/, ""); // '/api/xxx' -> '/xxx'
  }
  return `${BASE}${p}`;
}

// 공통 fetch (한 번만 body 읽음)
async function doFetch(url, options = {}) {
  const res = await fetch(url, options);
  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const payload = await (isJson ? res.json().catch(() => null) : res.text().catch(() => ""));

  if (!res.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload?.message || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  // 성공 시 body도 같이 반환
  return { res, payload };
}

// JSON POST (회원가입 등)
export async function postJSON(path, data, opts = {}) {
  const url = buildURL(path);
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
    ...(opts.headers || {}),
  };
  const { payload } = await doFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return payload;
}

// TEXT POST (로그인 전용)
export async function postText(path, data, opts = {}) {
  const url = buildURL(path);
  const headers = {
    "Content-Type": "application/json",
    Accept: "text/plain, */*",
    "ngrok-skip-browser-warning": "true",
    ...(opts.headers || {}),
  };
  const { payload } = await doFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  // ✅ 이미 doFetch에서 읽었으니 payload 바로 리턴
  return typeof payload === "string" ? payload : JSON.stringify(payload);
}

// 인증 포함 fetch (Bearer 자동)
export async function authFetch(path, options = {}) {
  const url = buildURL(path);
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json, text/plain, */*",
    "ngrok-skip-browser-warning": "true",
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    }
    const text = await res.text().catch(() => "");
    const err = new Error(text || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res;
}
