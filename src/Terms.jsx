import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-extrabold mb-6">이용약관</h1>

        <section className="space-y-6 text-sm leading-relaxed text-zinc-700">
          <p>
            본 약관은 AIMUSE(이하 “서비스”)의 이용과 관련하여 서비스 제공자와
            이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>

          <div>
            <h2 className="font-semibold text-lg mb-2">제1조 (목적)</h2>
            <p>
              본 약관은 이용자가 AIMUSE에서 제공하는 모든 기능 및 콘텐츠를
              이용함에 있어, 서비스 이용 조건 및 절차, 이용자와 서비스 제공자의
              권리·의무를 명확히 함을 목적으로 합니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제2조 (용어의 정의)</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>“이용자”란 본 서비스를 이용하는 모든 사람을 말합니다.</li>
              <li>
                “콘텐츠”란 서비스 내에서 제공되는 모든 형태의 자료, 데이터,
                문서, 이미지, 음성, 소프트웨어 등을 포함합니다.
              </li>
              <li>
                “회원”은 서비스 이용을 위해 로그인한 이용자를 의미합니다.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제3조 (서비스의 제공)</h2>
            <p>
              AIMUSE는 음원 분석, 악보 생성, 음원 분리 등 AI 기반 기능을 제공합니다.
              단, 서비스 내용은 기술적 사유나 정책 변경에 따라 변경될 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제4조 (이용자의 의무)</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>타인의 정보를 도용하거나 부정하게 이용하지 않습니다.</li>
              <li>저작권 등 타인의 권리를 침해하는 자료를 업로드하지 않습니다.</li>
              <li>서비스 운영을 방해하거나 불법적인 행위를 하지 않습니다.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제5조 (저작권 및 콘텐츠)</h2>
            <p>
              서비스 내 생성된 콘텐츠의 저작권은 원저작자 또는 AIMUSE에 귀속됩니다.
              이용자는 이를 무단 복제, 배포, 상업적 이용할 수 없습니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제6조 (면책조항)</h2>
            <p>
              서비스는 기술적 오류나 데이터 손실에 대해 책임을 지지 않습니다.
              또한, 이용자가 업로드한 음원의 저작권 문제에 대해서는
              이용자 본인이 모든 법적 책임을 집니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제7조 (약관의 변경)</h2>
            <p>
              본 약관은 법령이나 서비스 정책에 따라 변경될 수 있으며,
              변경 시 사이트 내 공지사항을 통해 안내합니다.
            </p>
          </div>

          <p className="text-xs text-zinc-500">
            본 약관은 2025년 11월 10일부터 시행됩니다.
          </p>
        </section>
      </main>
       <Footer />
    </div>
  );
}
