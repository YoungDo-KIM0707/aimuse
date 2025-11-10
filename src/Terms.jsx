// src/Terms.jsx
import Header from "./components/Header";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더는 최상단, 풀폭 */}
      <Header />
      {/* 본문만 폭 제한 */}
     <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">이용약관</h1>
       
      </main>
    </div>
  );
}
