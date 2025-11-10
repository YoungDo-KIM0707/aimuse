import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./components/Footer";


export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const MASTER_ID = "qwer";
    const MASTER_PW = "1234";

    if (id === MASTER_ID && pw === MASTER_PW) {
      localStorage.setItem("loggedIn", "true");
      navigate("/");
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ 상단 헤더 복구 */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-30">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          {/* AIMUSE 로고 클릭 시 홈으로 이동 */}
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight hover:opacity-80"
          >
            AIMUSE
          </Link>
        </nav>
      </header>

      {/* ✅ 로그인 폼 */}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="mt-2 bg-black text-white rounded-lg py-2 hover:bg-gray-800"
            >
              로그인
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
