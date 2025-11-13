// src/App.jsx
// AIMUSE 최소퀄리티 업그레이드 v1
// - Tailwind 기반 심플/깔끔 레이아웃
// - 상단 네비게이션, 히어로, 기능 섹션, 단계 안내, FAQ, 푸터
// - 요구사항: 브랜드 타이틀 아래 불필요 버튼 제거(CTA 1개만 유지)

import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              음원에서{" "}
              <span className="underline decoration-gray-300">
                자동으로 악보
              </span>
              까지
            </h1>
            <p className="mt-4 text-gray-600">
              Demucs, CREPE, librosa 등을 결합해 음원을 분리하고
              음높이/리듬을 추출하여 MIDI/PDF 악보로 변환하는 통합 시스템.
            </p>
          </div>
            {/* 🎬 YouTube 빨간색 플레이 버튼 버전 */}
<div className="rounded-2xl border bg-white p-6 shadow-sm">
  <a
    href="https://www.youtube.com/watch?v=bVlngOPkljI"
    target="_blank"
    rel="noopener noreferrer"
    className="block relative aspect-video overflow-hidden rounded-xl group"
  >
    {/* 썸네일 */}
    <img
      src="https://i.ytimg.com/vi/bVlngOPkljI/maxresdefault.jpg"
      alt="AIMUSE Demo"
      className="h-full w-full object-cover group-hover:brightness-75 transition"
    />

    {/* ❤️ 유튜브 정식 빨간 플레이 버튼 */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="
          bg-[#ff0000] 
          group-hover:bg-[#ff2020]
          w-28 h-20
          rounded-[30px] 
          flex items-center justify-center 
          transition-all duration-200
          group-hover:scale-110
          shadow-xl
        "
      >
        <svg
          className="w-10 h-10 text-white ml-1"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  </a>

  {/* 작은 기능 태그 */}
  <ul className="mt-4 grid grid-cols-3 gap-3 text-sm text-gray-600">
    <li className="rounded-lg border p-3"><span className="block text-xs text-gray-400">분리</span>피아노</li>
    <li className="rounded-lg border p-3"><span className="block text-xs text-gray-400">피치</span>노트/온셋 감지</li>
    <li className="rounded-lg border p-3"><span className="block text-xs text-gray-400">출력</span>MIDI / PDF</li>
  </ul>
</div>



          </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-xl font-bold">핵심 기능</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            { title: "소스 분리", desc: "Demucs 기반으로 피아노 트랙 분리" },
            {
              title: "피치 추출",
              desc: "CREPE로 음높이 추정 및 노트 이벤트 검출",
            },
            {
              title: "리듬/온셋",
              desc: "onset/beat 감지로 리듬 정보 계산",
            },
            {
              title: "MIDI/PDF 출력",
              desc: "librosa 처리 결과를 MIDI와 악보(PDF)로 내보내기",
            },
            {
              title: "라이브 녹음 대응",
              desc: "스튜디오 외 환경에서도 실사용 가능 목표",
            },
            {
              title: "간편 워크플로우",
              desc: "업로드 → 분석 → 악보까지 원클릭",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border p-5 shadow-sm">
              <div className="text-base font-semibold">{f.title}</div>
              <div className="mt-1 text-sm text-gray-600">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section className="border-y bg-gray-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-xl font-bold">사용 방법 (3단계)</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { n: 1, t: "파일 업로드", d: "오디오 파일(mp3/wav)을 업로드" },
              { n: 2, t: "분석/추출", d: "트랙 분리·피치/리듬 추출 진행" },
              { n: 3, t: "악보 출력", d: "MIDI/PDF로 다운로드" },
            ].map((s) => (
              <li
                key={s.n}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="text-3xl font-extrabold">{s.n}</div>
                <div className="mt-2 font-semibold">{s.t}</div>
                <div className="text-sm text-gray-600">{s.d}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-xl font-bold">FAQ</h2>
        <div className="mt-6 space-y-3">
          {[
            {
              q: "지금 바로 변환되나요?",
              a: "네 지금 바로 변환 가능합니다.",
            },
            {
              q: "지원 포맷은?",
              a: "입력: mp3/wav 등 / 출력: MIDI, PDF(예정).",
            },
            {
              q: "라이브 녹음도 되나요?",
              a: "목표는 라이브/잡음 환경에서도 쓸 수 있도록 모델/파이프라인을 보완하는 것입니다.",
            },
          ].map((item) => (
            <details key={item.q} className="group rounded-2xl border p-4">
              <summary className="cursor-pointer list-none font-medium">
                <span className="mr-2 select-none">Q.</span>
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-gray-700">
                <span className="mr-2 select-none">A.</span>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
