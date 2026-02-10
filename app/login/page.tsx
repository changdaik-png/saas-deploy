"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { createClient } from "../../utils/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic validation
        if (!email || !password) {
            setError("이메일과 비밀번호를 모두 입력해주세요.");
            setLoading(false);
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            setLoading(false);
            return;
        }

        // Auth logic
        try {
            if (isLogin) {
                // Log In
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Success -> Redirect handled by router in next tick or wait for callback
                router.refresh();
                router.push("/dashboard");
            } else {
                // Sign Up
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                // For simple email/password, usually auto sign-in unless confirm required.
                // Assuming email confirmation is OFF for testing or handled.
                // If require confirmation: alert("Please check email");
                // But for testing purposes, we assume success -> redirect.
                router.refresh();
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "로그인 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="w-full max-w-[400px] flex flex-col items-center relative z-10">
                <div className="mb-10 text-center flex flex-col items-center">
                    <Logo
                        href="/"
                        className="flex-col mb-4 gap-4"
                        iconSize="text-4xl"
                        textSize="text-3xl"
                    />
                    <p className="text-slate-500 dark:text-slate-400 mt-2">모든 생각이 연결되는 공간, 클라우드노트</p>
                </div>
                <div className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg flex items-center">
                            <button
                                onClick={() => { setIsLogin(true); setError(null); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin
                                        ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                    }`}
                            >
                                로그인
                            </button>
                            <button
                                onClick={() => { setIsLogin(false); setError(null); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin
                                        ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                    }`}
                            >
                                회원가입
                            </button>
                        </div>
                    </div>
                    <div className="p-8">
                        <form className="space-y-6" onSubmit={handleAuth}>
                            <Input
                                id="email"
                                type="email"
                                label="이메일"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<span className="material-icons text-lg">mail_outline</span>}
                            />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="password">
                                        비밀번호
                                    </label>
                                    {isLogin && (
                                        <a className="text-xs font-medium text-primary hover:underline" href="#">
                                            비밀번호 찾기
                                        </a>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    leftIcon={<span className="material-icons text-lg">lock_outline</span>}
                                />
                            </div>
                            {!isLogin && (
                                <Input
                                    id="password-confirm"
                                    type="password"
                                    label="비밀번호 확인"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    leftIcon={<span className="material-icons text-lg">lock_outline</span>}
                                />
                            )}

                            {error && (
                                <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                                    {error}
                                </div>
                            )}

                            <Button
                                fullWidth
                                size="lg"
                                type="submit"
                                isLoading={loading}
                                rightIcon={!loading && <span className="material-icons text-sm">arrow_forward</span>}
                            >
                                {isLogin ? "로그인" : "회원가입"}
                            </Button>
                        </form>
                        <div className="relative my-8 text-center">
                            <hr className="border-slate-200 dark:border-slate-800" />
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
                                간편 로그인
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="secondary" className="gap-2">
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <span className="text-lg font-bold text-blue-500">G</span>
                                </div>
                                <span className="text-sm font-medium">Google</span>
                            </Button>
                            <Button variant="secondary" className="gap-2">
                                <span className="material-icons text-xl text-slate-900 dark:text-white">apple</span>
                                <span className="text-sm font-medium">Apple</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <p className="mt-8 text-center text-slate-500 dark:text-slate-500 text-xs px-6 leading-relaxed">
                    계속 진행함으로써, CloudNote의{" "}
                    <a className="underline hover:text-primary" href="#">
                        서비스 약관
                    </a>{" "}
                    및{" "}
                    <a className="underline hover:text-primary" href="#">
                        개인정보 처리방침
                    </a>
                    에 동의하게 됩니다.
                </p>
            </div>
        </div>
    );
}
