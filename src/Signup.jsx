// src/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { postJSON } from "./lib/api"; // ★ BASE도 가져와서 디버그 찍자

export default function Signup() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [fieldErr, setFieldErr] = useState({ id: "", pw: "", pw2: "" });
  const [pending, setPending] = useState(false);

  const validate = () => {
    const next = { id: "", pw: "", pw2: "" };
    let ok = true;

    const email = id.trim().toLowerCase();
    if (!email) {
      next.id = "이메일을 입력하세요.";
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.id = "올바른 이메일 형식이 아닙니다.";
      ok = false;
    }
    if (pw.length < 4) {
      next.pw = "비밀번호는 8자 이상이어야 합니다.";
      ok = false;
    }
    if (pw2 !== pw) {
      next.pw2 = "비밀번호가 일치하지 않습니다.";
      ok = false;
    }

    setFieldErr(next);
    setError("");
    return ok;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (pending) return;              // ★ 중복 제출 방지
    if (!validate()) return;

    const email = id.trim().toLowerCase();
    try {
      setPending(true);

      // 디버그: 실제 요청 URL 확인
      console.log("[Signup] POST", `${BASE}/api/user/join`, { email });

      const res = await postJSON("/api/user/join", { email, password: pw });

      // 서버가 201/200에 바디 없을 수도 있음 → res가 string일 수 있음 (postJSON에서 처리)
      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      navigate("/login");
    } catch (e) {
      // 상태코드별 안내 강화 + 서버 메시지 우선 노출
      if (e.status === 409) setError("이미 가입된 이메일입니다.");
      else if (e.status === 400) setError(e.payload?.message || "요청 형식이 올바르지 않습니다.");
      else if (e.status === 401) setError("인증이 필요합니다(백엔드 시큐리티 설정 확인 필요).");
      else if (e.status === 403) setError("권한이 없습니다.");
      else if (e.status === 404) setError("가입 API 경로를 찾을 수 없습니다(/api/user/join 확인).");
      else if (e.status === 415) setError("서버가 JSON을 기대합니다. Content-Type 확인 필요.");
      else if (e.status >= 500) setError("서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.");
      else setError(e.message || "일시적인 오류가 발생했습니다.");

      // 추가 디버그(개발 중)
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn("[Signup error]", e.status, e.payload || e.message);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">이메일</label>
              <input
                type="email"
                autoComplete="email"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                  fieldErr.id ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="이메일을 입력하세요"
              />
              {fieldErr.id && <p className="mt-1 text-xs text-red-500">{fieldErr.id}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">비밀번호</label>
              <input
                type="password"
                autoComplete="new-password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                  fieldErr.pw ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="비밀번호 (8자 이상)"
              />
              {fieldErr.pw && <p className="mt-1 text-xs text-red-500">{fieldErr.pw}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">비밀번호 확인</label>
              <input
                type="password"
                autoComplete="new-password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                  fieldErr.pw2 ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="비밀번호를 한 번 더 입력하세요"
              />
              {fieldErr.pw2 && <p className="mt-1 text-xs text-red-500">{fieldErr.pw2}</p>}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full rounded-lg bg-black py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {pending ? "처리 중..." : "회원가입"}
            </button>

            <div className="text-center text-sm text-gray-500">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="underline hover:no-underline">로그인</Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
