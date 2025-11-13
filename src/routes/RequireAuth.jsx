// src/routes/RequireAuth.jsx
import { Navigate } from "react-router-dom";

// 로그인 안 한 유저를 /login으로 리다이렉트 시키는 보호 라우트
export default function RequireAuth({ children }) {
  const loggedIn = localStorage.getItem("loggedIn") === "true";

  if (!loggedIn) {
    // 로그인 안 된 경우 → /login으로 이동
    return <Navigate to="/login" replace />;
  }

  // 로그인된 경우 → 원래 페이지 출력
  return children;
}
