import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./components/Footer";

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  // 서버 없이 테스트하려면 true
  const USE_FAKE_LOGIN = true;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!id.trim() || !pw) {
      setError("이메일과 비밀번호를 입력하세요.");
      return;
    }

    try {
      setPending(true);
      let tokenStr = null;

      if (USE_FAKE_LOGIN) {
        // ✅ 서버 없이 임시 토큰
        tokenStr = "FAKE_TOKEN_" + Math.random().toString(36).slice(2);
        console.log("[FAKE LOGIN] 임시 토큰:", tokenStr);
      } else {
        // ✅ 실제 서버 로그인 요청
        const res = await fetch(
          "https://unrecusant-unecliptically-kristal.ngrok-free.dev/aimuse-server/api/user/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "text/plain, */*",
              "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({
              email: id.trim(),
              password: pw,
            }),
          }
        );

        if (!res.ok) {
          if (res.status === 401)
            throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
          else throw new Error(`HTTP ${res.status}`);
        }

        // ✅ 서버가 text/plain 형태로 JWT 반환
        tokenStr = await res.text();
      }

      if (!tokenStr || tokenStr.length < 10)
        throw new Error("토큰을 받지 못했습니다.");

      // ✅ 로그인 상태 저장
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userId", id.trim());
      localStorage.setItem("token", tokenStr.trim());

      console.log("[LOGIN] JWT 저장 완료:", tokenStr);

      // 비밀번호 필드 초기화
      setPw("");
      navigate("/");
    } catch (e) {
      console.error("[LOGIN ERROR]", e);
      setError(e.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-30">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight hover:opacity-80"
          >
            AIMUSE
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="이메일"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="border rounded-lg px-3 py-2"
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="border rounded-lg px-3 py-2"
              autoComplete="current-password"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 bg-black text-white rounded-lg py-2 hover:bg-gray-800 disabled:opacity-60"
            >
              {pending ? "로그인 중..." : "로그인"}
            </button>

            <Link
              to="/signup"
              className="block mt-3 text-sm text-gray-600 hover:underline text-center"
            >
              회원가입
            </Link>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
