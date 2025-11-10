// src/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./components/Header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@") || pw.length < 4) {
      setError("올바른 이메일과 4자 이상 비밀번호를 입력하세요.");
      return;
    }
    navigate("/"); // 로그인 성공 → 홈으로
  };

  return (
        <div className="min-h-screen bg-gray-50">
        <Header /> 
        <div className="w-full max-w-sm mx-auto mt-10 rounded-2xl bg-white p-8 shadow-md border">
        <h2 className="text-xl font-bold mb-2">AIMUSE 로그인</h2>
        <p className="mb-4 text-sm text-gray-600">계정으로 로그인해주세요.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              placeholder="4자 이상"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              minLength={4}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-black py-2 text-white font-medium hover:bg-gray-800"
          >
            로그인
          </button>
        </form>
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <span className="opacity-60">회원가입(추가 예정)</span>
        </div>
      </div>
    </div>
  );
}
