// src/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Signup() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");     // 폼 전체 에러
  const [fieldErr, setFieldErr] = useState({  // 필드별 에러
    id: "",
    pw: "",
    pw2: "",
  });
  const [pending, setPending] = useState(false);

  const validate = () => {
    const next = { id: "", pw: "", pw2: "" };
    let ok = true;

    if (!id.trim()) {
      next.id = "아이디를 입력하세요.";
      ok = false;
    }
    if (pw.length < 4) {
      next.pw = "비밀번호는 4자 이상이어야 합니다.";
      ok = false;
    }
    if (pw2 !== pw) {
      next.pw2 = "비밀번호가 일치하지 않습니다.";
      ok = false;
    }

    setFieldErr(next);
    setError(""); // 상단 공통 에러 초기화
    return ok;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // 백엔드 없으므로 데모용 처리
    try {
      setPending(true);
      await new Promise((r) => setTimeout(r, 600)); // 살짝 대기(UX)
      // 필요하면 임시 저장 (선택)
      localStorage.setItem("lastSignupUser", id);

      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      navigate("/login");
    } catch (err) {
      setError("일시적인 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 상단 헤더 (우측 로그인 버튼은 /signup에서 숨기도록 Header에서 이미 처리) */}
      <Header />

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>

          {/* 상단 공통 에러 */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {/* 아이디 */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                아이디
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                  fieldErr.id ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="아이디를 입력하세요"
              />
              {fieldErr.id && (
                <p className="mt-1 text-xs text-red-500">{fieldErr.id}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                  fieldErr.pw ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="비밀번호 (4자 이상)"
              />
              {fieldErr.pw && (
                <p className="mt-1 text-xs text-red-500">{fieldErr.pw}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                  fieldErr.pw2 ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="비밀번호를 한 번 더 입력하세요"
              />
              {fieldErr.pw2 && (
                <p className="mt-1 text-xs text-red-500">{fieldErr.pw2}</p>
              )}
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
              <Link to="/login" className="underline hover:no-underline">
                로그인
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
