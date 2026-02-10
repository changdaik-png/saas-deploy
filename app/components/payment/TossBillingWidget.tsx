"use client";

import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useState } from "react";
import Button from "../ui/Button";
import { createClient } from "../../../utils/supabase/client";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

export default function TossBillingWidget() {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleBilling = async () => {
        setLoading(true);
        try {
            const tossPayments = await loadTossPayments(clientKey);

            const { data: { user } } = await supabase.auth.getUser();
            // 유저별 고유 customerKey 생성
            // 환경 변수 NEXT_PUBLIC_TOSS_CUSTOMER_KEY_PREFIX 사용 (기본값: USER_)
            const prefix = process.env.NEXT_PUBLIC_TOSS_CUSTOMER_KEY_PREFIX || "USER_";
            const customerKey = user ? `${prefix}${user.id}` : "ANONYMOUS";

            // 빌링키 발급 요청 (카드 등록 창 띄우기)
            await tossPayments.requestBillingAuth("카드", {
                customerKey,
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            });

        } catch (error) {
            console.error("Billing Auth Failed:", error);
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
