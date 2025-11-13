// src/components/Header.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // /login 페이지에서는 헤더 숨김
  if (location.pathname === "/login") return null;

  // 로그인 상태/유저 아이디 (localStorage 기준)
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("loggedIn") === "true"
  );
  const [userId, setUserId] = useState(
    () => localStorage.getItem("userId") || "임시계정"
  );

  // 탭 간 동기화 (다른 탭에서 로그인/로그아웃 반영)
  useEffect(() => {
    const onStorage = () => {
      setLoggedIn(localStorage.getItem("loggedIn") === "true");
      setUserId(localStorage.getItem("userId") || "임시계정");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userId");
    setLoggedIn(false);
    navigate("/"); // 홈으로 이동
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur">
      <div className="border-b border-zinc-200">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          {/* 로고: 홈으로 */}
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight hover:opacity-80"
          >
            AIMUSE
          </Link>

          {/* 우측 영역: 로그인 전/후 전환 */}
          {!loggedIn ? (
   // 로그인 전: 회원가입 페이지에서는 로그인 버튼 숨김
   location.pathname !== "/signup" && (
     <Link
       to="/login"
       className="inline-flex items-center rounded-xl border px-4 py-1.5 text-sm font-medium hover:bg-gray-50"
     >
       로그인
     </Link>
  )
 ) : (
            // 로그인 후: 환영문구 + 마이페이지 + 로그아웃
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline text-gray-600">
                {userId}님 환영합니다 👋
              </span>
              <Link
                to="/me" // ✅ Mypages.jsx가 연결된 경로
                className="inline-flex items-center rounded-xl border px-3 py-1.5 hover:bg-gray-50"
                >
                  마이페이지
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-xl bg-black px-3 py-1.5 font-medium text-white hover:bg-gray-800"
              >
                로그아웃
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
