"use client";

import { useEffect, useState, useRef } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

interface PaymentSuccessContentProps {
    authKey: string | null;
    customerKey: string | null;
    paymentKey: string | null;
    orderId: string | null;
    amount: string | null;
}

export default function PaymentSuccessContent({
    authKey,
    customerKey,
    paymentKey,
    orderId,
    amount,
}: PaymentSuccessContentProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<any>(null);

    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;

        if (authKey && customerKey) {
            processedRef.current = true;
            confirmBilling();
            return;
        }
        if (paymentKey && orderId && amount) {
            processedRef.current = true;
            confirmPayment();
            return;
        }

        // 파라미터가 없는 경우에만 에러 처리 (하지만 strict mode로 인해 두 번 실행될 때 초기엔 null일 수도 있어 주의 필요)
        // 여기서는 파라미터가 아예 없으면 에러로 간주하되, 
        // useEffect가 의존성 배열 변경으로 다시 실행될 수 있으므로 조심스럽게 처리
        const hasParams = (authKey && customerKey) || (paymentKey && orderId && amount);
        if (!hasParams) {
            setLoading(false);
            setError("잘못된 접근입니다.");
        }
    }, [authKey, customerKey, paymentKey, orderId, amount]);

    const confirmBilling = async () => {
        try {
            const response = await fetch("/api/payment/billing/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authKey, customerKey }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessData(data.payment);
            } else {
                setError(data.error || "정기 결제 등록 실패");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const confirmPayment = async () => {
        try {
            const response = await fetch("/api/payment/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentKey, orderId, amount }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessData(data.payment);
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg font-medium text-slate-600">
                결제 및 구독 설정 중입니다...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                <span className="material-icons text-red-500 text-5xl mb-4">error_outline</span>
                <h1 className="text-2xl font-bold mb-2">처리 실패</h1>
                <p className="text-slate-500 mb-6">{error}</p>
                <a href="/payment" className="text-primary hover:underline">결제 페이지로 돌아가기</a>
            </div>
        );
    }

    return (
        <div className="font-sans bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center justify-center p-6 relative">
            <div className="w-full max-w-[390px] mx-auto flex flex-col items-center justify-between min-h-[85vh] relative">
                <div className="w-full flex flex-col items-center text-center mt-8">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 bg-green-500/10 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                            <span className="material-icons-round text-6xl text-green-500">check_circle</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">구독이 시작되었습니다!</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base">
                        매월 자동으로 결제됩니다.
                    </p>
                </div>

                <Card className="w-full bg-white dark:bg-background-dark/50 border border-slate-200 dark:border-primary/20 p-6 my-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary/80 dark:text-primary">
                                활성 플랜
                            </span>
                            <h2 className="text-xl font-bold mt-1">프로 정기 구독</h2>
                        </div>
                        <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                            <span className="material-icons-round text-primary text-2xl">autorenew</span>
                        </div>
                    </div>
                    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 dark:text-slate-400 text-sm">첫 결제 금액</span>
                            <span className="font-semibold text-sm">₩{(Number(successData?.amount || 0)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 dark:text-slate-400 text-sm">다음 결제일</span>
                            <span className="font-semibold text-sm text-primary">
                                {new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </Card>

                <div className="w-full space-y-4 pb-8">
                    <a href="/dashboard" className="w-full block">
                        <Button fullWidth size="lg">
                            대시보드로 이동
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
}
