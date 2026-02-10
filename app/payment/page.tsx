"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import TossBillingWidget from "../components/payment/TossBillingWidget";

export default function PaymentPage() {
    const router = useRouter();
    const [isCheckout, setIsCheckout] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
            <div className="h-12 w-full"></div>
            <header className="px-6 py-4 flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => isCheckout ? setIsCheckout(false) : router.back()}
                    className="rounded-full bg-slate-200/50 dark:bg-primary/10 hover:bg-slate-300/50 dark:hover:bg-primary/20"
                >
                    <span className="material-icons text-primary text-xl">{isCheckout ? "arrow_back" : "close"}</span>
                </Button>
                <span className="font-semibold text-lg">{isCheckout ? "정기 결제 등록" : "구독 요금제 안내"}</span>
                <div className="w-10 h-10"></div>
            </header>
            <main className="flex-1 px-6 pb-12 overflow-y-auto">
                {!isCheckout ? (
                    <>
                        <div className="text-center mt-4 mb-10">
                            <h1 className="text-3xl font-bold tracking-tight mb-3">생각을 더 넓게 펼치세요</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base max-w-[280px] mx-auto leading-relaxed">
                                CloudNote 프로와 함께 노트의 모든 가능성을 경험해 보세요.
                            </p>
                        </div>
                        <div className="flex justify-center mb-8">
                            <div className="bg-slate-200/50 dark:bg-primary/5 p-1 rounded-xl flex w-full max-w-[240px]">
                                <button className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-white dark:bg-primary shadow-sm text-slate-900 dark:text-white transition-all">
                                    월간 결제
                                </button>
                                <button className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                                    연간 결제
                                </button>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <Card className="relative bg-white dark:bg-[#1a242e] border-2 border-primary border-primary p-6 flex flex-col shadow-lg shadow-primary/10">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                    추천 요금제
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold">프로</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">파워 유저를 위한 기능</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold">월 9,900원</span>
                                        <span className="block text-[10px] text-slate-400 font-medium">VAT 포함</span>
                                    </div>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {[
                                        "무제한 클라우드 저장 용량",
                                        "모든 기기 실시간 동기화",
                                        "고급 마크다운 에디터 제공",
                                        "오프라인 접속 및 편집",
                                        "24/7 우선 기술 지원"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <span className="material-icons text-primary text-lg">check_circle</span>
                                            <span className="text-sm font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button fullWidth size="lg" onClick={() => setIsCheckout(true)}>9,900원 정기 결제 시작</Button>
                            </Card>
                            <Card className="bg-white/50 dark:bg-[#1a242e]/40 border-slate-200 dark:border-primary/10 p-6 flex flex-col opacity-80">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold">무료</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">기본적인 기록 기능</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold">0원</span>
                                        <span className="block text-[10px] text-slate-400 font-medium">평생 무료</span>
                                    </div>
                                </div>
                                <ul className="space-y-4 mb-6">
                                    {[
                                        "500MB 저장 용량 제한",
                                        "최대 2대 기기 동기화",
                                        "표준 마크다운 지원"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <span className="material-icons text-slate-400 dark:text-slate-600 text-lg">check_circle</span>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-primary/5">
                                    <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                        현재 이용 중인 요금제
                                    </p>
                                </div>
                            </Card>
                        </div>
                        <footer className="mt-12 text-center space-y-4">
                            <button className="text-sm font-medium text-primary py-2 px-4 hover:underline">구독 내역 복원하기</button>
                            <div className="flex justify-center items-center gap-4 text-[11px] text-slate-500 dark:text-slate-600">
                                <a className="hover:underline" href="#">
                                    이용약관
                                </a>
                                <span className="w-1 h-1 bg-slate-400 dark:bg-slate-700 rounded-full"></span>
                                <a className="hover:underline" href="#">
                                    개인정보 처리방침
                                </a>
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="max-w-lg mx-auto">
                        <TossBillingWidget />
                    </div>
                )}
            </main>
            <div className="pb-2 flex justify-center w-full">
                <div className="w-32 h-1 bg-slate-300 dark:bg-slate-800 rounded-full"></div>
            </div>
        </div>
    );
}
