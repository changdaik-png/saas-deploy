"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../utils/supabase/client";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

export default function SubscriptionStatus() {
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    const supabase = createClient();

    const fetchSubscription = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (!error && data) {
            setSubscription(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    const handleCancelSubscription = async () => {
        setCancelLoading(true);
        try {
            const response = await fetch("/api/payment/billing/cancel", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to cancel");
            }

            alert("구독이 취소되었습니다. 다음 결제일 전까지 혜택은 유지됩니다.");
            await fetchSubscription(); // 상태 갱신
            setShowCancelDialog(false);

        } catch (error) {
            alert("구독 취소 중 오류가 발생했습니다.");
        } finally {
            setCancelLoading(false);
        }
    };

    if (loading) {
        return <Card className="animate-pulse h-32 bg-slate-200 dark:bg-slate-800"><div /></Card>;
    }

    // 1. 구독 정보가 없거나 active가 아님 (취소되었으나 기간 만료된 경우 포함)
    if (!subscription || (subscription.status !== "active" && subscription.status !== "canceled")) {
        return (
            <Card className="mb-8 bg-gradient-to-br from-primary to-blue-600 border-none text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <Badge className="bg-white/20 text-white ring-0 mb-2">FREE PLAN</Badge>
                        <h3 className="font-bold text-lg leading-tight mb-1">PRO로 업그레이드하세요</h3>
                        <p className="text-blue-100 text-xs">무제한 용량과 AI 기능을 경험해보세요.</p>
                    </div>
                    <Link href="/payment">
                        <Button size="sm" className="bg-white text-primary hover:bg-white/90 shadow-none border-none">
                            업그레이드
                        </Button>
                    </Link>
                </div>
            </Card>
        );
    }

    // 2. 구독 취소됨 (기간은 남음)
    if (subscription.status === "canceled") {
        const endDate = new Date(subscription.current_period_end).toLocaleDateString();
        return (
            <Card className="mb-8 bg-slate-100 dark:bg-slate-800 border dark:border-slate-700 relative overflow-hidden">
                <div className="flex justify-between items-center">
                    <div>
                        <Badge variant="warning" className="mb-2">구독 취소됨</Badge>
                        <h3 className="font-bold text-lg leading-tight mb-1 text-slate-700 dark:text-slate-200">
                            {endDate}에 만료됩니다
                        </h3>
                        <p className="text-slate-500 text-xs">언제든 다시 구독하실 수 있습니다.</p>
                    </div>
                    <Link href="/payment">
                        <Button size="sm" variant="outline">
                            다시 구독하기
                        </Button>
                    </Link>
                </div>
            </Card>
        );
    }

    // 3. 구독 중 (Active)
    return (
        <>
            <Card className="mb-8 bg-gradient-to-br from-primary to-blue-600 border-none text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <Badge className="bg-white/20 text-white ring-0 mb-2">PRO PLAN</Badge>
                        <h3 className="font-bold text-lg leading-tight mb-1">프리미엄 기능 활성화됨</h3>
                        <p className="text-blue-100 text-xs">
                            다음 결제일: {new Date(subscription.next_payment_date).toLocaleDateString()}
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white shadow-none border-none backdrop-blur-sm"
                        onClick={() => setShowCancelDialog(true)}
                    >
                        구독 관리
                    </Button>
                </div>
            </Card>

            {/* 구독 취소 확인 다이얼로그 */}
            {showCancelDialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <Card className="max-w-sm w-full bg-white dark:bg-surface-dark p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">
                            정말 구독을 취소하시겠습니까?
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            구독을 취소해도 <strong>{new Date(subscription.current_period_end).toLocaleDateString()}</strong>까지는
                            PRO 기능을 계속 이용하실 수 있습니다. 이후에는 무료 플랜으로 전환됩니다.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => setShowCancelDialog(false)}
                                disabled={cancelLoading}
                            >
                                닫기
                            </Button>
                            <Button
                                className="bg-red-500 hover:bg-red-600 text-white border-none"
                                onClick={handleCancelSubscription}
                                isLoading={cancelLoading}
                            >
                                네, 취소합니다
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}
