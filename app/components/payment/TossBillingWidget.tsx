"use client";

import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useState } from "react";
import Button from "../ui/Button";
import { createClient } from "../../../utils/supabase/client";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

export default function TossBillingWidget() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleBilling = async () => {
        setLoading(true);
        setError(null);

        if (!clientKey) {
            setError("토스 클라이언트 키가 설정되지 않았습니다.");
            setLoading(false);
            return;
        }

        try {
            const tossPayments = await loadTossPayments(clientKey);

            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                setError("로그인 정보를 가져올 수 없습니다. 다시 로그인해 주세요.");
                setLoading(false);
                return;
            }

            const prefix = process.env.NEXT_PUBLIC_TOSS_CUSTOMER_KEY_PREFIX || "USER_";
            const customerKey = `${prefix}${user.id}`;

            await tossPayments.requestBillingAuth("카드", {
                customerKey,
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            });

        } catch (err: any) {
            console.error("Billing Auth Failed:", err);
            setError(err?.message || "결제 요청 중 오류가 발생했습니다.");
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                <h3 className="font-bold text-lg mb-2">정기 결제 카드 등록</h3>
                <p className="text-slate-500 text-sm mb-4">
                    등록된 카드로 매월 9,900원이 자동으로 결제됩니다.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="material-icons text-sm">lock</span>
                    <span>안전한 결제를 위해 카드 정보는 토스페이먼츠에 암호화되어 저장됩니다.</span>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            <Button
                fullWidth
                size="lg"
                onClick={handleBilling}
                isLoading={loading}
            >
                카드 등록하고 구독 시작하기
            </Button>
        </div>
    );
}
