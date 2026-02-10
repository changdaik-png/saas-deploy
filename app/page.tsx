import Image from "next/image";
import Link from "next/link";
import Logo from "./components/ui/Logo";
import Button from "./components/ui/Button";
import Badge from "./components/ui/Badge";

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans min-h-screen">
      <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link className="hidden sm:block text-sm font-medium hover:text-primary transition-colors" href="#pricing">
              가격
            </Link>
            <Link href="/login">
              <Button variant="primary" size="sm" className="bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/30 shadow-none">
                로그인
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className="relative pt-12 pb-16 px-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="relative z-10 max-w-md mx-auto text-center">
            <Badge className="mb-6">신규 기능: 데스크톱 동기화 2.0</Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
              당신의 생각을 <br />
              <span className="text-primary">클라우드에 정리하세요</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed">
              어디서나 간편하게 동기화되는 스마트한 메모 서비스. <br className="hidden sm:block" /> 안전한 클라우드
              아키텍처로 아이디어를 즉시 캡처하고 다시는 노트를 잃어버리지 마세요.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/login" className="w-full">
                <Button fullWidth size="lg">지금 시작하기</Button>
              </Link>
              <Link href="/dashboard" className="w-full">
                <Button fullWidth size="lg" variant="secondary" className="bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700">대시보드 보기</Button>
              </Link>
            </div>
          </div>
          <div className="mt-16 relative max-w-sm mx-auto">
            <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800 dark:border-slate-700 relative w-full h-auto aspect-[390/844]">
              <Image
                alt="클라우드노트 대시보드"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcD4Ep0gnK9bj9tGWwOQRBgycxrpTygrk7-hmNT4AbM2Lb6IfqR8axGl4Zh7s4IJqRh0A6YwV5Wgg7ZJEtH0PSF4j0TUZOT5KCuLrhGJBMo4AYnE54YkYwy4MDvEllc9EKZFfcATlbfowUcVZ4wBP8yZ0hpWpVE67VjcJSx1kcBNtZZyloljFOVL993OGscKD4pfwq_BbmqZ1LHVtDSaG6lyvxEzhYPbi8mCqT3y6oDccI1Cx81wgBrYcwMPBlQHgJjm0QP4A_708P"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
        <section className="py-8 border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="px-4 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
              10,000명 이상의 크리에이터가 신뢰합니다
            </p>
            <div className="flex justify-center items-center gap-8 opacity-40 grayscale">
              <span className="material-icons text-3xl">corporate_fare</span>
              <span className="material-icons text-3xl">token</span>
              <span className="material-icons text-3xl">hub</span>
              <span className="material-icons text-3xl">settings_input_component</span>
            </div>
          </div>
        </section>
        <section className="py-20 px-4 bg-background-light dark:bg-background-dark" id="pricing">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">요금제 선택</h2>
              <p className="text-slate-600 dark:text-slate-400">개인과 팀을 위한 심플한 가격 정책.</p>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">베이직</h3>
                    <p className="text-slate-500 text-sm">개인 사용자에게 적합</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">₩0</span>
                    <span className="text-slate-500 text-xs block">영원히 무료</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-icons text-primary text-sm">check_circle</span>
                    <span>최대 50개 노트</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-icons text-primary text-sm">check_circle</span>
                    <span>웹 및 모바일 접속</span>
                  </li>
                </ul>
                <Button fullWidth variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  현재 요금제
                </Button>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-primary shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-tight">
                  가장 인기 있는 요금제
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">프로</h3>
                    <p className="text-slate-500 text-sm">파워 유저를 위한 기능</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">₩9,900</span>
                    <span className="text-slate-500 text-xs block">월 정기 결제</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-icons text-primary text-sm">check_circle</span>
                    <span>무제한 노트 생성</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-icons text-primary text-sm">check_circle</span>
                    <span>오프라인 모드</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-icons text-primary text-sm">check_circle</span>
                    <span>고급 AI 검색 기능</span>
                  </li>
                </ul>
                <Link href="/payment" className="w-full">
                  <Button fullWidth>지금 업그레이드</Button>
                </Link>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">팀</h3>
                    <p className="text-slate-500 text-sm">소규모 협업용</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">₩19,900</span>
                    <span className="text-slate-500 text-xs block">월 정기 결제</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-icons text-primary text-sm">check_circle</span>
                    <span>최대 10명 사용자</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-icons text-primary text-sm">check_circle</span>
                    <span>공유 워크스페이스</span>
                  </li>
                </ul>
                <Button fullWidth variant="secondary" className="border-slate-300 dark:border-slate-700">영업팀 문의하기</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 px-4">
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-primary text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
            <h2 className="text-3xl font-bold mb-4 relative z-10">생산성을 높일 준비가 되셨나요?</h2>
            <p className="text-primary-100 mb-8 opacity-90 relative z-10">
              10만 명 이상의 사용자와 함께 스마트하게 일상을 정리하세요.
            </p>
            <Link href="/login">
              <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg w-full relative z-10">
                무료로 시작하기
              </button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="py-12 px-4 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="material-icons text-white text-xs">cloud</span>
          </div>
          <span className="font-bold text-lg tracking-tight">클라우드노트</span>
        </div>
        <div className="flex justify-center gap-6 mb-8 text-slate-500 text-sm">
          <Link className="hover:text-primary" href="#">
            개인정보 처리방침
          </Link>
          <Link className="hover:text-primary" href="#">
            이용약관
          </Link>
          <Link className="hover:text-primary" href="#">
            고객지원
          </Link>
        </div>
        <p className="text-slate-500 text-xs">© 2024 CloudNote Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
