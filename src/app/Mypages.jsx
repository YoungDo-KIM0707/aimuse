// src/app/Mypages.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { authFetch } from "../lib/api";

const UPLOAD_ENDPOINT = "/api/music/upload";
// 🔵 서버 안 켜놨을 때: true  → 프론트에서만 업로드 성공 처리
// 🔵 나중에 백엔드 연결할 때: false → 실제 서버로 업로드
const USE_MOCK_UPLOAD = true;

// 🔽 이 두 개는 백엔드 친구랑 맞춰서 엔드포인트만 바꾸면 됨
const PDF_DOWNLOAD_ENDPOINT = "/api/music/result/pdf";
const MIDI_DOWNLOAD_ENDPOINT = "/api/music/result/midi";

export default function Mypages() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);

  // 🔹 pendingInstrument: 체크박스로 고른 "임시" 악기
  // 🔹 instrument: 확인 버튼으로 확정된 악기 (다운로드/라벨/미리보기 기준)
  const [pendingInstrument, setPendingInstrument] = useState(null);
  const [instrument, setInstrument] = useState(null);

  // 확인 눌렀는지 여부 → 눌러야 다운로드/미리보기 노출
  const [showDownload, setShowDownload] = useState(false);

  // 미리보기 상태
  const [previewUrl, setPreviewUrl] = useState(null);     // PDF blob URL 또는 "mock"
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);  // 열림/접힘 토글 상태

  const inputRef = useRef(null);

  // --- 파일 선택 ---
  const onPick = (f) => {
    if (!f) return;

    if (f.type !== "audio/mpeg" && !f.name.toLowerCase().endsWith(".mp3")) {
      setErr("MP3 파일만 업로드할 수 있습니다.");
      setFile(null);
      return;
    }

    if (f.size > 50 * 1024 * 1024) {
      setErr("파일 크기가 너무 큽니다. (최대 50MB)");
      setFile(null);
      return;
    }

    setErr("");
    setMsg("");
    setFile(f);
  };

  // --- 업로드 ---
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file || pending) return;

    setPending(true);
    setMsg("");
    setErr("");
    setShowDownload(false);     // 새로 업로드하면 이전 결과 영역 숨김
    setPendingInstrument(null); // 임시 선택 초기화
    setInstrument(null);        // 확정 선택 초기화
    setPreviewUrl(null);        // 미리보기 초기화
    setPreviewOpen(false);      // 접힌 상태로 초기화

    // 🔵 임시 모드: 서버 안 켜져 있을 때 여기서 바로 성공 처리
    if (USE_MOCK_UPLOAD) {
      setMsg("업로드가 완료되었습니다.");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setPending(false);
      return; // 실제 서버 호출 스킵
    }

    // 🔵 실제 서버 업로드 모드
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await authFetch(UPLOAD_ENDPOINT, {
        method: "POST",
        body: fd,
      });

      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        await res.json().catch(() => null);
      } else {
        await res.text().catch(() => "");
      }

      setMsg("업로드가 완료되었습니다.");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (e2) {
      if (e2.status === 401) setErr("인증이 만료되었습니다. 다시 로그인해 주세요.");
      else if (e2.status === 403) setErr("권한이 없습니다. (403)");
      else setErr(e2.message || "업로드 중 오류가 발생했습니다.");
    } finally {
      setPending(false);
    }
  };

  // --- 파일 다운로드 공통 함수 (authFetch + blob → 강제 다운로드) ---
  const handleDownload = async (endpoint, filename) => {
    try {
      const res = await authFetch(endpoint, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("다운로드 중 오류가 발생했습니다.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message || "다운로드에 실패했습니다.");
    }
  };

  // --- 악보 미리보기 (PDF) 토글 ---
  const handlePreview = async (endpoint) => {
    // 이미 열려 있으면 → 접기
    if (previewOpen) {
      setPreviewOpen(false);
      return;
    }

    // 닫혀 있고, 이미 URL이 있음 → 다시 열기만
    if (previewUrl) {
      setPreviewOpen(true);
      return;
    }

    // 처음 여는 경우 → 가져오기
    setPreviewLoading(true);
    setPreviewOpen(false);

    // 🔵 서버 안 켜진 상태에서는 임시 박스만 노출
    if (USE_MOCK_UPLOAD) {
      setTimeout(() => {
        setPreviewUrl("mock"); // 임시 값
        setPreviewLoading(false);
        setPreviewOpen(true);
      }, 300);
      return;
    }

    try {
      const res = await authFetch(endpoint, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("미리보기 불러오기 중 오류가 발생했습니다.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      setPreviewUrl((prev) => {
        if (prev && prev !== "mock") {
          window.URL.revokeObjectURL(prev);
        }
        return url;
      });
      setPreviewOpen(true);
    } catch (e) {
      alert(e.message || "미리보기를 불러오지 못했습니다.");
    } finally {
      setPreviewLoading(false);
    }
  };

  // --- 악기 선택 확인 ---
  const onCheck = () => {
    if (!pendingInstrument) {
      alert("악기를 선택해주세요!");
      return;
    }
    // ✔ 여기서만 진짜 선택 악기 변경
    setInstrument(pendingInstrument);
    setShowDownload(true);
    setPreviewOpen(false); // 악기 바꾸고 다시 확인하면 일단 접기
  };

  // 악기별 설명 문구 (확정된 instrument 기준)
  const instrumentLabel =
    instrument === "piano"
      ? "피아노"
      : instrument === "guitar"
      ? "기타"
      : "선택되지 않음";

  const instrumentDescription =
    instrument === "piano"
      ? "피아노 연습 및 채보를 위한 악보가 생성됩니다."
      : instrument === "guitar"
      ? "기타 코드 및 리듬을 중심으로 한 악보가 생성됩니다."
      : "악기를 선택하면 해당 악기에 맞춘 악보와 MIDI 파일을 제공합니다.";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-3xl p-6">
        {/* 제목 + 피드백 페이지 이동 버튼 */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">마이페이지 — 음악 업로드</h1>

          <button
            onClick={() => navigate("/feedback")}
            className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
          >
            피드백 화면
          </button>
        </div>

        {/* 파일 업로드 폼 */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div
            className="border-2 border-dashed rounded-2xl p-8 text-center bg-white cursor-pointer hover:bg-gray-50"
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="audio/mpeg,.mp3"
              className="hidden"
              onChange={(e) => onPick(e.target.files?.[0])}
            />
            <p className="text-gray-600">
              {file ? `선택된 파일: ${file.name}` : "여기를 클릭해 MP3 파일을 선택하세요."}
            </p>
          </div>

          {/* 메시지 */}
          {msg && (
            <div className="border border-green-200 bg-green-50 p-3 rounded-lg text-sm text-green-700">
              {msg}
            </div>
          )}
          {err && (
            <div className="border border-red-200 bg-red-50 p-3 rounded-lg text-sm text-red-700">
              {err}
            </div>
          )}

          {/* 업로드 버튼 */}
          <button
            type="submit"
            disabled={!file || pending}
            className="w-full rounded-xl bg-black py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {pending ? "업로드 중..." : "업로드"}
          </button>
        </form>

        {/* ★ 업로드 성공 후에만 체크박스 + 확인 버튼 노출 ★ */}
        {msg === "업로드가 완료되었습니다." && (
          <div className="mt-6 p-5 bg-white border rounded-2xl shadow-sm">
            <div className="flex items-center justify_between mb-3">
              <h2 className="text-lg font-semibold">악기 선택</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                선택된 악기: <span className="font-semibold">{instrumentLabel}</span>
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-4">{instrumentDescription}</p>

            <div className="flex items-center space-x-6">
              {/* 체크박스는 "임시 선택"만 담당 → pendingInstrument 기준 */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pendingInstrument === "piano"}
                  onChange={() => setPendingInstrument("piano")}
                />
                <span>피아노</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pendingInstrument === "guitar"}
                  onChange={() => setPendingInstrument("guitar")}
                />
                <span>기타</span>
              </label>

              <button
                onClick={onCheck}
                className="px-4 py-1 bg-black text-white rounded-lg text-sm"
              >
                확인
              </button>
            </div>

            {/* ✅ 확인 누른 이후에만 다운로드 / 미리보기 버튼 표시 (확정 instrument 기준) */}
            {showDownload && instrument && (
              <div className="mt-5 space-y-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(
                        PDF_DOWNLOAD_ENDPOINT,
                        instrument === "piano" ? "piano_score.pdf" : "guitar_score.pdf"
                      )
                    }
                    className="px-4 py-2 rounded-lg border bg-gray-100 text-sm hover:bg-gray-200"
                  >
                    악보 PDF 다운로드
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(
                        MIDI_DOWNLOAD_ENDPOINT,
                        instrument === "piano" ? "piano.mid" : "guitar.mid"
                      )
                    }
                    className="px-4 py-2 rounded-lg border bg-gray-100 text-sm hover:bg-gray-200"
                  >
                    음원 MIDI 다운로드
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePreview(PDF_DOWNLOAD_ENDPOINT)}
                    className="px-4 py-2 rounded-lg border bg-gray-100 text-sm hover:bg-gray-200"
                  >
                    {previewOpen ? "악보 미리보기 접기" : "악보 미리보기"}
                  </button>
                </div>

                {/* 🔍 미리보기 영역 (흰 배경 + 그림자 카드 스타일, 토글 가능) */}
                {previewLoading && (
                  <div className="mt-2 text-sm text-gray-500">
                    악보를 불러오는 중입니다...
                  </div>
                )}

                {previewOpen && previewUrl && (
                  <div className="mt-3 rounded-2xl bg-white shadow-md border p-4">
                    {USE_MOCK_UPLOAD && previewUrl === "mock" ? (
                      <div className="h-80 flex items-center justify-center text-center text-gray-500 text-sm">
                        현재는 데모 모드입니다.
                        <br />
                        백엔드 연동 후에는 실제 악보 PDF가 이 영역에 표시됩니다.
                      </div>
                    ) : (
                      <iframe
                        title="악보 미리보기"
                        src={previewUrl}
                        className="w-full h-96 rounded-xl"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
