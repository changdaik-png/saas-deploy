"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";

export default function NotePage() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-primary/20 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="-ml-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                    >
                        <span className="material-icons">menu_open</span>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <Logo iconSize="text-xl" textSize="text-lg" />
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <span className="material-icons text-xl">more_horiz</span>
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                        저장
                    </Button>
                </div>
            </header>
            <main className="flex-1 flex overflow-hidden relative">
                <aside className={`w-80 border-r border-slate-200 dark:border-primary/10 bg-white/50 dark:bg-slate-900/50 overflow-y-auto no-scrollbar shrink-0 ${isSidebarOpen ? 'block absolute inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 shadow-xl' : 'hidden md:block'}`}>
                    {/* Sidebar content */}
                    <div className="p-4 space-y-1">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">최근 노트</span>
                            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 p-1 rounded transition-colors w-auto h-auto">
                                <span className="material-icons text-sm">add_circle_outline</span>
                            </Button>
                        </div>
                        {/* Note items kept as custom due to specific layout */}
                        <div className="bg-primary/10 border-l-4 border-primary rounded-lg p-4 cursor-pointer">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold text-slate-900 dark:text-white truncate pr-2">프로젝트 알파 아이디어</h3>
                                <span className="text-[10px] text-slate-500 whitespace-nowrap">2분 전</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                새로운 UI 키트 구성 요소 및 시스템 아키텍처를 위한 브레인스토밍 세션...
                            </p>
                        </div>
                        {[
                            { title: "장보기 목록", time: "1시간 전", content: "유기농 우유, 아보카도, 사워도우 빵, 원두 커피 (다크 로스트)..." },
                            { title: "회의록 - 10월 24일", time: "어제", content: "4분기 예산 배분 및 신규 채용 계획에 대해 논의함..." },
                            { title: "디자인 영감", time: "10월 20일", content: "다음 프로젝트를 위한 미니멀리스트 일본 건축 및 바우하우스 컬러 팔레트..." },
                            { title: "운동 루틴", time: "10월 18일", content: "하체 데이: 스쿼트 4x12, 런지 3x15, 레그 프레스 3x10. 자세에 집중..." }
                        ].map((note, index) => (
                            <div key={index} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg p-4 cursor-pointer transition-colors group">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">{note.title}</h3>
                                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{note.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2">
                                    {note.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
                )}

                <section className="flex-1 flex flex-col bg-white dark:bg-background-dark relative overflow-y-auto w-full">
                    <div className="max-w-3xl mx-auto w-full px-6 pt-10 pb-24">
                        <input
                            className="w-full bg-transparent border-none text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 focus:ring-0 px-0 mb-6 focus:outline-none"
                            placeholder="노트 제목을 입력하세요"
                            type="text"
                            defaultValue="프로젝트 알파 아이디어"
                        />
                        <div className="flex items-center gap-4 mb-8 text-xs text-slate-400 border-y border-slate-100 dark:border-slate-800 py-3">
                            <div className="flex items-center gap-1">
                                <span className="material-icons text-sm text-primary">schedule</span>
                                <span>수정일: 10월 24일, 오전 10:45</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-icons text-sm text-primary">edit_note</span>
                                <span>1,240자</span>
                            </div>
                        </div>
                        <textarea
                            className="w-full bg-transparent border-none text-lg leading-relaxed text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-700 focus:ring-0 px-0 min-h-[50vh] resize-none focus:outline-none"
                            placeholder="내용을 입력하세요..."
                            defaultValue={`새로운 UI 키트 구성 요소 및 시스템 아키텍처를 위한 브레인스토밍 세션.
다음 단계:
1. Polaris 및 Carbon과 같은 기존 디자인 시스템 조사.
2. 접근성 표준에 따른 핵심 컬러 팔레트 정의.
3. 8pt 그리드를 사용한 모듈식 간격 배율 설정.
성능과 개발자 경험에 중점을 두어야 합니다. 문서가 컴포넌트 라이브러리에 직접 통합되도록 해야 합니다.
일관성을 유지하면서 사용자에게 큰 유연성을 제공하는 Tailwind를 스타일링 엔진으로 사용하는 것을 고려해보세요.`}
                        />
                    </div>
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-200 dark:border-primary/20 p-2 flex items-center justify-between z-50">
                        <div className="flex items-center">
                            {[
                                { icon: "format_bold" },
                                { icon: "format_italic" },
                                { icon: "format_list_bulleted" },
                                { icon: "image" },
                                { icon: "link" }
                            ].map((btn, idx) => (
                                <Button key={idx} variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-icons">{btn.icon}</span>
                                </Button>
                            ))}
                        </div>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
                        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                            <span className="material-icons">keyboard_hide</span>
                        </Button>
                    </div>
                </section>
            </main>
            <Button
                className="md:hidden fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform z-40 bg-primary text-white"
                onClick={() => { }} // Add create note logic
            >
                <span className="material-icons">add</span>
            </Button>
        </div>
    );
}
