// src/app/Feedback.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// 🔢 피아노 주파수 테이블 (C3~C6 중심)
const PIANO_FREQUENCIES = {
  // 3옥타브
  C3: 130.81,
  "C#3": 138.59,
  D3: 146.83,
  "D#3": 155.56,
  E3: 164.81,
  F3: 174.61,
  "F#3": 185.0,
  G3: 196.0,
  "G#3": 207.65,
  A3: 220.0,
  "A#3": 233.08,
  B3: 246.94,
  // 4옥타브
  C4: 261.63,
  "C#4": 277.18,
  D4: 293.66,
  "D#4": 311.13,
  E4: 329.63,
  F4: 349.23,
  "F#4": 369.99,
  G4: 392.0,
  "G#4": 415.3,
  A4: 440.0,
  "A#4": 466.16,
  B4: 493.88,
  // 5옥타브
  C5: 523.25,
  "C#5": 554.37,
  D5: 587.33,
  "D#5": 622.25,
  E5: 659.25,
  F5: 698.46,
  "F#5": 739.99,
  G5: 783.99,
  "G#5": 830.61,
  A5: 880.0,
  "A#5": 932.33,
  B5: 987.77,
  // 6옥타브 (조금만)
  C6: 1046.5,
  "C#6": 1108.73,
  D6: 1174.66,
  "D#6": 1244.51,
  E6: 1318.51,
  F6: 1396.91,
  "F#6": 1479.98,
  G6: 1567.98,
};

// 🔁 주파수 → 가장 가까운 음계
function frequencyToNote(freq) {
  if (!freq || freq < 100 || freq > 2000) return null;

  let closestNote = null;
  let minDiff = Infinity;

  for (const [note, noteFreq] of Object.entries(PIANO_FREQUENCIES)) {
    const diff = Math.abs(freq - noteFreq);
    if (diff < minDiff) {
      minDiff = diff;
      closestNote = note;
    }
  }

  // 오차 허용 범위 (±10Hz)
  if (minDiff > 10) return null;
  return closestNote;
}

export default function Feedback() {
  const navigate = useNavigate();

  // 🔐 로그인 체크 (토큰 키 이름은 프로젝트에 맞게 조정)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  // 🎤 상태
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("대기 중 – 녹음 시작을 눌러주세요");
  const [detectedNote, setDetectedNote] = useState("-");
  const [detectedFreq, setDetectedFreq] = useState(null);

  // Web Audio / 캔버스용 ref
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationIdRef = useRef(null);
  const canvasRef = useRef(null);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopAudio();
      clearCanvas();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🎨 캔버스 초기화
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // 🔚 Web Audio 전체 정리
  const stopAudio = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // 🎬 녹음+분석 시작
  const handleStart = async () => {
    try {
      // 이전 것 정리
      stopAudio();
      clearCanvas();
      setDetectedNote("-");
      setDetectedFreq(null);

      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          sampleRate: 16384,
        },
      });
      streamRef.current = stream;

      // 오디오 컨텍스트
      const audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16384,
      });
      audioContextRef.current = audioContext;

      // 분석 노드
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096; // 4096 샘플 → 4Hz 해상도
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // 마이크 소스를 Analyser에 연결
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      const bufferLength = analyser.frequencyBinCount; // 2048
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;

      setIsRunning(true);
      setStatus("녹음 중… 피아노(또는 앱)로 도/레/미를 쳐보세요!");

      // 분석 루프 시작
      analyzeLoop();
    } catch (err) {
      console.error(err);
      alert("마이크 권한을 허용해주세요.");
      setStatus("마이크 권한이 필요합니다.");
    }
  };

  // ⏹ 분석 중지
  const handleStop = () => {
    stopAudio();
    setIsRunning(false);
    setStatus("중지됨 – 다시 시작하려면 녹음 시작을 누르세요");
    setDetectedNote("-");
    setDetectedFreq(null);
    clearCanvas();
  };

  // 🔄 리셋 (완전 초기화)
  const handleReset = () => {
    handleStop();
    setStatus("대기 중 – 녹음 시작을 눌러주세요");
    setDetectedNote("-");
    setDetectedFreq(null);
    clearCanvas();
  };

  // 🎛 FFT 분석 루프
  const analyzeLoop = () => {
    const analyser = analyserRef.current;
    const audioContext = audioContextRef.current;
    const dataArray = dataArrayRef.current;
    const canvas = canvasRef.current;

    if (!analyser || !audioContext || !dataArray || !canvas) return;

    const canvasCtx = canvas.getContext("2d");
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const loop = () => {
      analyser.getByteFrequencyData(dataArray);

      // === 스펙트럼 그리기 ===
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      const barWidth = (WIDTH / dataArray.length) * 2.5;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * HEIGHT;
        const r = barHeight + 25 * (i / dataArray.length);
        const g = 250 * (i / dataArray.length);
        const b = 50;
        canvasCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      // === 가장 큰 피크 찾기 ===
      let maxValue = 0;
      let maxIndex = 0;
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] > maxValue) {
          maxValue = dataArray[i];
          maxIndex = i;
        }
      }

      // 임계값 체크 (노이즈 필터링)
      if (maxValue > 80) {
        const freqResolution = audioContext.sampleRate / analyser.fftSize; // 4Hz
        const freq = maxIndex * freqResolution;

        const note = frequencyToNote(freq);
        if (note) {
          setDetectedNote(note);
          setDetectedFreq(freq);
        } else {
          setDetectedNote("-");
          setDetectedFreq(null);
        }
      } else {
        setDetectedNote("-");
        setDetectedFreq(null);
      }

      animationIdRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  const activeKey = detectedNote && detectedNote !== "-" ? detectedNote[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-3xl p-6">
        {/* 타이틀 */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">연주 피드백 (음계 인식 테스트)</h1>
        </div>

        <section className="bg-white border rounded-2xl shadow-sm p-5 space-y-4">
          {/* 설명 */}
          <div>
            <h2 className="text-lg font-semibold mb-1">Web Audio + FFT</h2>
            <p className="text-sm text-gray-600">
              마이크로 들어오는 소리를 실시간으로 FFT 분석하여 가장 강한 주파수를 찾고,
              피아노 음계(C3~C6)로 매핑합니다. 도/레/미 등을 눌러서 인식이 잘 되는지 테스트해보세요.
            </p>
          </div>

          {/* 상태 */}
          <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm">
            {status}
          </div>

          {/* 인식 결과 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="text-xs text-gray-500">감지된 음계</div>
            <div className="text-5xl font-bold h-16 flex items-center justify-center">
              {detectedNote}
            </div>
            <div className="text-sm text-gray-500">
              주파수: {detectedFreq ? `${detectedFreq.toFixed(2)} Hz` : "-"}
            </div>
          </div>

          {/* 피아노 시각화 */}
          <div className="flex justify-center gap-2 mt-3">
            {["C", "D", "E", "F", "G", "A", "B"].map((key) => (
              <div
                key={key}
                className={
                  "w-12 h-24 border rounded-b-xl flex items	end justify-center pb-2 text-xs font-semibold transition-all " +
                  (activeKey === key
                    ? "bg-gradient-to-b from-indigo-400 to-purple-500 text-white translate-y-1 shadow-xl"
                    : "bg-white text-gray-800")
                }
              >
                {key}
              </div>
            ))}
          </div>

          {/* 스펙트럼 캔버스 */}
          <div className="mt-4">
            <canvas
              ref={canvasRef}
              width={600}
              height={150}
              className="w-full h-40 rounded-lg bg-black/50"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleStart}
              disabled={isRunning}
              className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm disabled:opacity-60"
            >
              🎤 녹음 시작
            </button>
            <button
              type="button"
              onClick={handleStop}
              disabled={!isRunning}
              className="px-4 py-2 rounded-full bg-rose-600 text-white text-sm disabled:opacity-60"
            >
              ⏹ 중지
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-gray-500 text-white text-sm"
            >
              🔄 리셋
            </button>
          </div>

          <p className="text-[11px] text-gray-400 mt-2">
            * 단일 음 위주, 조용한 환경에서 테스트하면 인식이 더 잘 됩니다.  
            (배음/노이즈 때문에 옥타브가 튈 수도 있음)
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
