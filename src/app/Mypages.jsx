// src/app/Mypages.jsx
import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// 절대 URL (ngrok + 컨텍스트 + api)
const BASE = "https://unrecusant-unecliptically-kristal.ngrok-free.dev/aimuse-server/api";
const UPLOAD_URL = `${BASE}/music/upload`;
const STATUS_URL = (id) => `${BASE}/music/${id}`;

export default function Mypages() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);

  // 상태 조회용
  const [lastId, setLastId] = useState(null);
  const [proc, setProc] = useState({ status: null, url: null }); // {status, url}
  const [polling, setPolling] = useState(false);
  const pollTimer = useRef(null);

  const inputRef = useRef(null);

  // 파일 선택
  const onPick = (f) => {
    if (!f) return;
    if (f.type !== "audio/mpeg" && !f.name.toLowerCase().endsWith(".mp3")) {
      setErr("MP3 파일만 업로드할 수 있습니다.");
      setFile(null);
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setErr("파일 크기가 너무 큽니다. (최대 50MB 권장)");
      setFile(null);
      return;
    }
    setErr("");
    setFile(f);
  };

  // 업로드
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file || pending) return;
    setPending(true);
    setMsg("");
    setErr("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("로그인 토큰이 없습니다. 다시 로그인해 주세요.");

      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "ngrok-skip-browser-warning": "true",
        },
        body: fd,
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("401 Unauthorized — 로그인 만료");
        if (res.status === 403) throw new Error("403 Forbidden — 권한 없음");
        throw new Error(`업로드 실패 (HTTP ${res.status})`);
      }

      const payload = await res.json(); // { musicId, status, userId }
      setMsg(`✅ 업로드 성공! musicId=${payload.musicId}, status=${payload.status}`);
      setLastId(payload.musicId);
      setProc({ status: payload.status ?? "PENDING", url: null });

      // 파일 입력 리셋
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";

      // 바로 1회 조회 후 폴링 시작
      await fetchStatus(payload.musicId, true);
      startPolling(payload.musicId);
    } catch (e2) {
      setErr(e2.message || "업로드 중 오류가 발생했습니다.");
    } finally {
      setPending(false);
    }
  };

  // 상태 조회
  const fetchStatus = async (musicId, quiet = false) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("로그인 토큰이 없습니다. 다시 로그인해 주세요.");

      const res = await fetch(STATUS_URL(musicId), {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("401 Unauthorized — 로그인 만료");
        if (res.status === 403) throw new Error("403 Forbidden — 본인 소유 파일만 조회 가능");
        if (res.status === 404) throw new Error("해당 musicId를 찾을 수 없습니다.");
        throw new Error(`조회 실패 (HTTP ${res.status})`);
      }

      const data = await res.json(); // { musicId, status, resultMusicUrl }
      setProc({ status: data.status, url: data.resultMusicUrl ?? null });

      if (!quiet) setMsg(`📡 상태: ${data.status}`);

      // 완료/실패면 폴링 중지
      if (data.status === "COMPLETED" || data.status === "FAILED") {
        stopPolling();
        if (data.status === "COMPLETED") {
          setMsg("🎉 처리 완료! 아래 다운로드 링크로 결과를 받으세요.");
        } else {
          setErr("❌ 처리 실패");
        }
      }
      return data;
    } catch (e) {
      if (!quiet) setErr(e.message || "상태 조회 중 오류가 발생했습니다.");
      throw e;
    }
  };

  // 폴링 시작/중지
  const startPolling = (musicId) => {
    stopPolling();
    setPolling(true);
    pollTimer.current = setInterval(() => {
      fetchStatus(musicId, true).catch(() => {}); // 조용히 재시도
    }, 3000); // 3초 간격
  };

  const stopPolling = () => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
    setPolling(false);
  };

  // 언마운트 시 타이머 정리
  useEffect(() => stopPolling, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-3xl p-6">
        <h1 className="text-2xl font-bold mb-4">마이페이지 — 음악 업로드 / 결과 조회</h1>

        {/* 업로드 폼 */}
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

          <button
            type="submit"
            disabled={!file || pending}
            className="w-full rounded-xl bg-black py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {pending ? "업로드 중..." : "업로드"}
          </button>
        </form>

        {/* 상태/다운로드 영역 */}
        {lastId && (
          <div className="mt-8 rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                <div>최근 업로드 ID: <b>{lastId}</b></div>
                <div>
                  현재 상태:{" "}
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                    {proc.status || "-"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchStatus(lastId)}
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  상태 새로고침
                </button>
                {polling ? (
                  <button
                    onClick={stopPolling}
                    className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    폴링 중지
                  </button>
                ) : (
                  <button
                    onClick={() => startPolling(lastId)}
                    className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    폴링 시작
                  </button>
                )}
              </div>
            </div>

            {proc.status === "COMPLETED" && proc.url && (
              <div className="mt-4">
                <a
                  href={proc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  결과 MP3 다운로드
                </a>
                <p className="mt-2 text-xs text-gray-500">
                  * 링크는 약 1시간 후 만료됩니다. 만료 시 다시 조회하여 새 URL을 받아주세요.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
