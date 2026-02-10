"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { createClient } from "../../utils/supabase/client";

import SubscriptionStatus from "../components/dashboard/SubscriptionStatus";

export default function DashboardPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [subscription, setSubscription] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                // 구독 정보 가져오기
                const { data, error } = await supabase
                    .from("subscriptions")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (!error && data) {
                    setSubscription(data);
                }
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const isPro = subscription?.status === "active";

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-border-dark px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden"
                    >
                        <span className="material-icons">menu</span>
                    </Button>
                    <Logo iconSize="text-xl" textSize="text-lg" />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="relative text-slate-500 dark:text-slate-400">
                        <span className="material-icons">notifications_none</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
                    </Button>
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600">
                            {/* User Avatar Placeholder */}
                            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                                {user?.email?.[0].toUpperCase() || "U"}
                            </div>
                        </div>
                        {isPro && (
                            <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[8px] font-bold px-1 rounded-sm border border-white dark:border-surface-dark">
                                PRO
                            </span>
                        )}
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full pb-24">
                <section className="mb-8">
                    <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
                        안녕하세요, <span className="text-primary">{user?.user_metadata?.full_name || "사용자"}님</span> 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">오늘의 영감을 기록해보세요.</p>
                </section>
                <section className="grid grid-cols-2 gap-3 mb-8">
                    <Card className="flex flex-col gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <span className="material-icons text-lg">description</span>
                        </div>
                        <div>
                            <span className="text-2xl font-bold">12</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400">전체 메모</p>
                        </div>
                    </Card>
                    <Card className="flex flex-col gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <span className="material-icons text-lg">cloud</span>
                        </div>
                        <div>
                            <span className="text-2xl font-bold">{isPro ? "무제한" : "24%"}</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400">저장 공간 {isPro ? "" : "(1.2GB)"}</p>
                        </div>
                    </Card>
                </section>

                {/* 구독 상태 컴포넌트 */}
                <SubscriptionStatus initialSubscription={subscription} />

                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">최근 활동</h3>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">모두 보기</Button>
                    </div>
                    <div className="space-y-3">
                        <Card hoverEffect className="flex items-center gap-3 p-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                                <span className="material-icons text-xl">lightbulb</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">비즈니스 아이디어 스케치</h4>
                                <p className="text-xs text-slate-500 truncate">2시간 전 • 아이디어</p>
                            </div>
                            <Button variant="ghost" size="icon">
                                <span className="material-icons text-slate-400 text-lg">navigate_next</span>
                            </Button>
                        </Card>
                        <Card hoverEffect className="flex items-center gap-3 p-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                                <span className="material-icons text-xl">check_circle</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">주간 쇼핑 리스트</h4>
                                <p className="text-xs text-slate-500 truncate">어제 • 개인</p>
                            </div>
                            <Button variant="ghost" size="icon">
                                <span className="material-icons text-slate-400 text-lg">navigate_next</span>
                            </Button>
                        </Card>
                        <Card hoverEffect className="flex items-center gap-3 p-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                <span className="material-icons text-xl">work</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">Q4 마케팅 전략 회의록</h4>
                                <p className="text-xs text-slate-500 truncate">10월 22일 • 업무</p>
                            </div>
                            <Button variant="ghost" size="icon">
                                <span className="material-icons text-slate-400 text-lg">navigate_next</span>
                            </Button>
                        </Card>
                    </div>
                </section>
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">저장된 메모</h3>
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                            <button className="p-1 rounded-md bg-white dark:bg-slate-700 shadow-sm">
                                <span className="material-icons text-sm text-slate-900 dark:text-white block">grid_view</span>
                            </button>
                            <button className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <span className="material-icons text-sm block">view_list</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/note" className="block">
                            <Card hoverEffect className="h-full flex flex-col justify-between aspect-[4/5] p-5">
                                <div>
                                    <h4 className="font-bold text-base mb-2 line-clamp-2">프로젝트 알파 디자인 시스템 기획</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed">
                                        메인 컬러 팔레트 선정 및 타이포그래피 계층 구조 설계 필요. 경쟁사 벤치마킹...
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <Badge variant="info">업무</Badge>
                                    <span className="text-[10px] text-slate-400">10:42 AM</span>
                                </div>
                            </Card>
                        </Link>
                        <Link href="/note" className="block">
                            <Card hoverEffect className="h-full flex flex-col justify-between aspect-[4/5] p-5">
                                <div>
                                    <h4 className="font-bold text-base mb-2 line-clamp-2">여행 계획: 일본 교토</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed">
                                        1일차: 기요미즈데라, 2일차: 아라시야마 대나무 숲, 3일차: ...
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <Badge variant="success">여행</Badge>
                                    <span className="text-[10px] text-slate-400">어제</span>
                                </div>
                            </Card>
                        </Link>
                        <Link href="/note" className="block">
                            <Card hoverEffect className="h-full flex flex-col justify-between aspect-[4/5] p-5">
                                <div>
                                    <h4 className="font-bold text-base mb-2 line-clamp-2">읽고 싶은 책 목록</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed">
                                        - 사피엔스 (유발 하라리)
                                        - 코스모스 (칼 세이건)
                                        - ...
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <Badge variant="warning">독서</Badge>
                                    <span className="text-[10px] text-slate-400">10월 20일</span>
                                </div>
                            </Card>
                        </Link>
                        <Link href="/note" className="block cursor-pointer group">
                            <div className="h-full flex flex-col justify-center items-center aspect-[4/5] bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all">
                                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <span className="material-icons text-primary text-2xl">add</span>
                                </div>
                                <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">새 메모 만들기</span>
                            </div>
                        </Link>
                    </div>
                </section>
            </main>
            <nav className="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-lg border-t border-slate-200 dark:border-border-dark px-6 py-3 pb-8 z-50 flex justify-between items-center">
                <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary">
                    <span className="material-icons">dashboard</span>
                    <span className="text-[10px] font-medium">홈</span>
                </Link>
                <Link href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <span className="material-icons">folder</span>
                    <span className="text-[10px] font-medium">폴더</span>
                </Link>
                <div className="-mt-8">
                    <Link href="/note">
                        <button className="w-14 h-14 bg-primary rounded-full shadow-xl shadow-primary/30 flex items-center justify-center text-white transform active:scale-90 transition-transform border-4 border-white dark:border-background-dark">
                            <span className="material-icons text-2xl">add</span>
                        </button>
                    </Link>
                </div>
                <Link href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <span className="material-icons">search</span>
                    <span className="text-[10px] font-medium">검색</span>
                </Link>
                <Link href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <span className="material-icons">settings</span>
                    <span className="text-[10px] font-medium">설정</span>
                </Link>
            </nav>
            {/* Sidebar Overlay and Drawer */}
            <div
                className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsSidebarOpen(false)}
            >
                <aside
                    className={`fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white dark:bg-surface-dark shadow-2xl transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <Logo iconSize="text-xl" textSize="text-lg" />
                            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                                <span className="material-icons">close</span>
                            </Button>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl mb-6">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600">
                                    {/* Placeholder Avatar */}
                                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                                        {user?.email?.[0].toUpperCase() || "U"}
                                    </div>
                                </div>
                                {isPro && (
                                    <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[8px] font-bold px-1 rounded-sm border border-white dark:border-surface-dark">
                                        PRO
                                    </span>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">{user?.user_metadata?.full_name || "사용자"}</h4>
                                <p className="text-xs text-slate-500">{user?.email}</p>
                            </div>
                        </div>
                        <nav className="flex-1 space-y-1">
                            <Button variant="ghost" fullWidth className="justify-start text-primary bg-primary/10">
                                <span className="material-icons mr-3">dashboard</span>
                                대시보드
                            </Button>
                            <Button variant="ghost" fullWidth className="justify-start">
                                <span className="material-icons mr-3">description</span>
                                내 노트
                            </Button>
                            <Button variant="ghost" fullWidth className="justify-start">
                                <span className="material-icons mr-3">star_outline</span>
                                즐겨찾기
                            </Button>
                            <Button variant="ghost" fullWidth className="justify-start">
                                <span className="material-icons mr-3">delete_outline</span>
                                휴지통
                            </Button>
                            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                                <Button variant="ghost" fullWidth className="justify-start">
                                    <span className="material-icons mr-3">settings</span>
                                    설정
                                </Button>
                                <Button variant="ghost" fullWidth className="justify-start">
                                    <span className="material-icons mr-3">help_outline</span>
                                    고객지원
                                </Button>
                            </div>
                        </nav>
                        {!isPro && (
                            <div className="mt-auto">
                                <Card className="bg-primary/5 border-primary/20">
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="material-icons text-primary">auto_awesome</span>
                                        <div>
                                            <h5 className="font-bold text-sm text-primary">PRO 업그레이드</h5>
                                            <p className="text-[10px] text-slate-500 mt-1">무제한 용량과 AI 기능을 경험해보세요.</p>
                                        </div>
                                    </div>
                                    <Link href="/payment">
                                        <Button size="sm" fullWidth>업그레이드</Button>
                                    </Link>
                                </Card>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
