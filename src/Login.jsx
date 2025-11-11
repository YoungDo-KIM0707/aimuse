import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./components/Footer";
import { postText } from "./lib/api"; // ★ postJSON 대신 postText

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false); // ★ 버튼 비활성용

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // 간단 검증(선택)
    if (!id.trim() || !pw) {
      setError("이메일과 비밀번호를 입력하세요.");
      return;
    }

    try {
      setPending(true);

      // ★ 로그인은 문자열 토큰 응답
      const tokenStr = await postText("/api/user/login", {
        email: id.trim(),
        password: pw,
      });
      if (!tokenStr) throw { status: 500, message: "토큰을 받지 못했습니다." };

      // 상태 저장
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userId", id.trim());
      localStorage.setItem("token", tokenStr);

      // 입력값 클리어(선택)
      setPw("");

      // 홈으로
      navigate("/");
    } catch (e) {
      if (e.status === 401) setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      else setError(e.message || "일시적인 오류가 발생했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-30">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="text-xl font-extrabold tracking-tight hover:opacity-80">
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

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
