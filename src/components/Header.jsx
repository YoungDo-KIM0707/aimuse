// src/components/Header.jsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur">
      {/* 풀폭(전체 너비) 래퍼에 밑줄 적용 */}
      <div className="border-b border-zinc-200">
        {/* 안쪽은 컨테이너로 폭 제한 */}
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight hover:opacity-80"
          >
            AIMUSE
          </Link>
          
        </nav>
      </div>
    </header>
  );
}
