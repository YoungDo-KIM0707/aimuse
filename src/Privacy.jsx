import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-extrabold mb-6">개인정보 처리방침</h1>

        <section className="space-y-6 text-sm leading-relaxed text-zinc-700">
          <p>
            AIMUSE(이하 “서비스”)는 이용자의 개인정보를 중요하게 생각하며,
            「개인정보 보호법」 등 관련 법령을 준수합니다.
            본 방침은 이용자가 서비스를 이용할 때 제공한 개인정보가
            어떻게 이용·보호되는지를 안내하기 위한 것입니다.
          </p>

          <div>
            <h2 className="font-semibold text-lg mb-2">제1조 (수집하는 개인정보 항목)</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>필수 항목: 이메일 주소, 로그인 ID, 비밀번호</li>
              <li>선택 항목: 이름, 프로필 이미지, 악보/음원 업로드 내역</li>
              <li>
                서비스 이용 과정에서 IP 주소, 접속 로그, 쿠키, 이용 기록 등이
                자동으로 생성·수집될 수 있습니다.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제2조 (개인정보의 수집 및 이용 목적)</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>회원 식별 및 로그인 관리</li>
              <li>음원 업로드 및 악보 변환 서비스 제공</li>
              <li>서비스 개선, 오류 분석 및 고객 지원</li>
              <li>이용자 문의 대응 및 공지사항 전달</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제3조 (개인정보의 보유 및 이용 기간)</h2>
            <p>
              이용자의 개인정보는 회원 탈퇴 시 즉시 삭제되며,
              관계 법령에 따라 일정 기간 보관이 필요한 경우에는
              다음의 기간 동안 보관됩니다.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>로그인 기록: 3개월 (통신비밀보호법)</li>
              <li>계약 또는 청약철회 기록: 5년 (전자상거래법)</li>
              <li>소비자 불만 및 분쟁 처리 기록: 3년 (전자상거래법)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제4조 (개인정보의 제3자 제공)</h2>
            <p>
              서비스는 이용자의 동의 없이는 개인정보를 제3자에게 제공하지 않습니다.
              다만, 법령에 의거하여 관계 기관의 요청이 있는 경우 예외적으로 제공될 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제5조 (개인정보 처리의 위탁)</h2>
            <p>
              서비스는 안정적인 운영을 위해 필요한 경우 외부 전문 업체에
              개인정보 처리를 위탁할 수 있으며, 위탁 시 관련 법령에 따라
              위탁사와의 계약 및 관리·감독을 철저히 이행합니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제6조 (이용자의 권리와 행사 방법)</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>이용자는 언제든 본인 정보 열람, 수정, 삭제를 요청할 수 있습니다.</li>
              <li>탈퇴 및 개인정보 삭제는 “회원탈퇴” 메뉴를 통해 직접 진행 가능합니다.</li>
              <li>
                개인정보 오류 정정 및 삭제 요청 시 즉시 조치하며, 삭제된 정보는 복구되지 않습니다.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제7조 (개인정보의 보호 및 관리)</h2>
            <p>
              서비스는 개인정보 보호를 위해 암호화, 접근 제한, 백업 관리 등
              기술적·관리적 안전조치를 시행합니다.
              단, 이용자의 부주의나 네트워크 환경으로 발생한 문제는 책임지지 않습니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">제8조 (쿠키의 사용)</h2>
            <p>
              서비스는 이용자의 편의를 위해 쿠키를 사용할 수 있습니다.
              이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나,
              이 경우 일부 기능 이용에 제한이 있을 수 있습니다.
            </p>
          </div>

          

          <p className="text-xs text-zinc-500">
            본 개인정보 처리방침은 2025년 11월 10일부터 시행됩니다.
          </p>
        </section>
      </main>
       <Footer />
    </div>
  );
}
