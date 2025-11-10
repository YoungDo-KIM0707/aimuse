// src/App.jsx
// AIMUSE 최소퀄리티 업그레이드 v1
// - Tailwind 기반 심플/깔끔 레이아웃
// - 상단 네비게이션, 히어로, 업로드 섹션(더미), 기능 섹션, 단계 안내, FAQ, 푸터
// - 요구사항: 브랜드 타이틀 아래 불필요 버튼 제거(CTA 1개만 유지)

import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header";
export default function App() {
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | uploading | done

  const onFakeUpload = async (e) => {
    e.preventDefault();
    if (!fileName) return;
    setStatus("uploading");
    // 실제 업로드/변환 API 연동 전까지는 데모 대기 처리
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("done");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <a href="#" className="text-xl font-extrabold tracking-tight">AIMUSE</a>
          <div className="flex items-center gap-3">
           <Link
           to="/login"
            className="inline-flex items-center rounded-xl border px-4 py-1.5 text-sm font-medium hover:bg-gray-50"
            >
           로그인
           </Link>

          </div>
        </nav>
      </header>
      

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">음원에서 <span className="underline decoration-gray-300">자동으로 악보</span>까지</h1>
            <p className="mt-4 text-gray-600">Demucs, CREPE, librosa 등을 결합해 음원을 분리하고 음높이/리듬을 추출하여 MIDI/PDF 악보로 변환하는 통합 시스템.</p>
            <p className="mt-3 text-xs text-gray-500">* 현재는 데모 인터랙션으로 동작. 실제 변환 API 연결 예정.</p>
          </div>
          <div className="rounded-2xl border bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
            <div className="aspect-video overflow-hidden rounded-xl border bg-black/90">
              {/* 데모 썸네일 */}
              <div className="flex h-full items-center justify-center text-white/70">AIMUSE Demo Preview</div>
            </div>
            <ul className="mt-4 grid grid-cols-3 gap-3 text-sm text-gray-600">
              <li className="rounded-lg border p-3"><span className="block text-xs text-gray-400">분리</span>피아노</li>
              <li className="rounded-lg border p-3"><span className="block text-xs text-gray-400">피치</span>노트/온셋 감지</li>
              <li className="rounded-lg border p-3"><span className="block text-xs text-gray-400">출력</span>MIDI / PDF</li>
            </ul>
          </div>
        </div>
      </section>

      {/* UPLOAD (DEMO) */}
      <section id="upload" className="border-y bg-gray-50/60">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-xl font-bold">파일 업로드</h2>
          <p className="mt-1 text-sm text-gray-600">현재는 프론트 데모 단계입니다. 실제 처리 서버 연결 전까지는 업로드 시뮬레이션만 수행합니다.</p>

          <form onSubmit={onFakeUpload} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-sm hover:bg-gray-50 sm:max-w-md">
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
              <span className="truncate text-gray-600">{fileName || "오디오 파일 선택 (mp3, wav 등)"}</span>
              <span className="shrink-0 rounded-lg border px-3 py-1">찾아보기</span>
            </label>
            <button
              type="submit"
              disabled={!fileName || status === "uploading"}
              className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "uploading" ? "업로드 중..." : status === "done" ? "완료" : "업로드"}
            </button>
          </form>

          {status === "done" && (
            <div className="mt-4 rounded-xl border bg-white p-4 text-sm text-gray-700">
              업로드가 완료되었습니다. 변환 대기열에 등록되었습니다. (데모 메시지)
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-xl font-bold">핵심 기능</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            { title: "소스 분리", desc: "Demucs 기반으로 피아노 트랙 분리" },
            { title: "피치 추출", desc: "CREPE로 음높이 추정 및 노트 이벤트 검출" },
            { title: "리듬/온셋", desc: "onset/beat 감지로 리듬 정보 계산" },
            { title: "MIDI/PDF 출력", desc: "librosa 처리 결과를 MIDI와 악보(PDF)로 내보내기" },
            { title: "라이브 녹음 대응", desc: "스튜디오 외 환경에서도 실사용 가능 목표" },
            { title: "간편 워크플로우", desc: "업로드 → 분석 → 악보까지 원클릭" },
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
              <li key={s.n} className="rounded-2xl border bg-white p-5 shadow-sm">
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
            { q: "지금 바로 변환되나요?", a: "현재는 데모 화면입니다. 백엔드 API 연동 후 실변환 지원 예정입니다." },
            { q: "지원 포맷은?", a: "입력: mp3/wav 등 / 출력: MIDI, PDF(예정)." },
            { q: "라이브 녹음도 되나요?", a: "목표는 라이브/잡음 환경에서도 쓸 수 있도록 모델/파이프라인을 보완하는 것입니다." },
          ].map((item) => (
            <details key={item.q} className="group rounded-2xl border p-4">
              <summary className="cursor-pointer list-none font-medium">
                <span className="mr-2 select-none">Q.</span>{item.q}
              </summary>
              <p className="mt-2 text-sm text-gray-700">
                <span className="mr-2 select-none">A.</span>{item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-10 text-sm text-gray-600">
          <div>© {new Date().getFullYear()} AIMUSE</div>
          <div className="space-x-3">
            <Link to="/terms" className="hover:underline">이용약관</Link>
            <Link to="/privacy" className="hover:underline">개인정보</Link>
            <Link to="/creators" className="hover:underline">크리에이터</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
