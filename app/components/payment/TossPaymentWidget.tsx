"use client";

import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";
const customerKey = "ANONYMOUS"; // 비회원 결제 시 사용 (회원 결제 시 유니크한 ID 사용 권장)

export default function TossPaymentWidget() {
    const router = useRouter();
    const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
    const paymentMethodsWidgetRef = useRef<ReturnType<
        PaymentWidgetInstance["renderPaymentMethods"]
    > | null>(null);
    const [price, setPrice] = useState(9900);
    const [isReady, setIsReady] = useState(false);
    const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
    const [userName, setUserName] = useState<string | undefined>(undefined);

    const supabase = createClient();

    useEffect(() => {
        // 유저 정보 가져오기
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email);
                // user_metadata에 이름이 있다면 가져옴, 없으면 이메일 앞부분 등 사용
                setUserName(user.user_metadata?.full_name || user.email?.split('@')[0]);
            }
        };
        fetchUser();

        (async () => {
            // ------  결제위젯 초기화 ------
            // @docs https://docs.tosspayments.com/reference/widget-sdk#sdk-설치-및-초기화
            const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

            // ------  결제 UI 렌더링 ------
            // @docs https://docs.tosspayments.com/reference/widget-sdk#renderpaymentmethods선택자-결제-금액-옵션
            const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                "#payment-widget",
                { value: price },
                { variantKey: "DEFAULT" }
            );

            // ------  이용약관 UI 렌더링 ------
            // @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
            paymentWidget.renderAgreement(
                "#agreement",
                { variantKey: "AGREEMENT" }
            );

            paymentWidgetRef.current = paymentWidget;
            paymentMethodsWidgetRef.current = paymentMethodsWidget;
            setIsReady(true);
        })();
    }, [supabase.auth]);

    useEffect(() => {
        const paymentMethodsWidget = paymentMethodsWidgetRef.current;

        if (paymentMethodsWidget == null) {
            return;
        }

        // ------ 금액 업데이트 ------
        // @docs https://docs.tosspayments.com/reference/widget-sdk#updateamount결제-금액
        paymentMethodsWidget.updateAmount(price);
    }, [price]);

    const handlePayment = async () => {
        const paymentWidget = paymentWidgetRef.current;

        try {
            // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
            // @docs https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
            await paymentWidget?.requestPayment({
                orderId: `ORDER_${new Date().getTime()}`,
                orderName: "CloudNote Pro - 월간 구독",
                customerName: userName || "익명 사용자",
                customerEmail: userEmail,
                customerMobilePhone: "01012341234",
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            });
        } catch (error) {
            // 에러 처리하기
            console.error(error);
        }
    };

    return (
        <div className="w-full">
            {/* 결제 UI, 이용약관 UI 영역 */}
            <div id="payment-widget" className="w-full" />
            <div id="agreement" className="w-full" />

            <div className="mt-8 px-6">
                <Button
                    fullWidth
                    size="lg"
                    onClick={handlePayment}
                    disabled={!isReady}
                    id="payment-button"
                >
                    {price.toLocaleString()}원 결제하기
                </Button>
            </div>
        </div>
    );
}
