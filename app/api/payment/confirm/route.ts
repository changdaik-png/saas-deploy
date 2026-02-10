import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function POST(req: NextRequest) {
    const { paymentKey, orderId, amount } = await req.json();

    if (!paymentKey || !orderId || !amount) {
        return NextResponse.json(
            { error: "Missing required parameters" },
            { status: 400 }
        );
    }

    // 1. Supabase Client 생성 (이 API를 호출한 유저 정보 확인용)
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
        return NextResponse.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    // 2. 토스페이먼츠 승인 요청
    const basicAuth = Buffer.from(`${secretKey}:`).toString("base64");

    try {
        const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount,
            }),
        });

        const paymentData = await response.json();

        if (!response.ok) {
            // 결제 승인 실패
            console.error("Payment Confirmation Failed:", paymentData);
            return NextResponse.json(
                { error: paymentData.message || "Payment confirmation failed" },
                { status: response.status }
            );
        }

        // 3. 결제 성공 시 Supabase DB에 저장

        // 3-1. Payments 테이블에 저장
        const { error: paymentError } = await supabase
            .from("payments")
            .insert({
                user_id: user.id,
                payment_key: paymentKey,
                order_id: orderId,
                amount: amount,
                status: "DONE",
                method: paymentData.method,
                approved_at: paymentData.approvedAt,
                receipt_url: paymentData.receipt?.url,
                // 기타 필요한 정보들...
            });

        if (paymentError) {
            console.error("Failed to save payment to DB:", paymentError);
            // 이미 결제는 승인되었으므로 에러를 반환하되, 로깅은 필수
            // 여기서 롤백(결제취소)을 할지, 아니면 무시하고 진행할지는 정책 결정 필요.
            // 여기서는 에러를 반환하지 않고 구독 처리 시도
        }

        // 3-2. Subscriptions 테이블 업데이트 (또는 생성)
        // 1달 구독이라 가정
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // 1개월 후

        const { error: subscriptionError } = await supabase
            .from("subscriptions")
            .upsert({
                user_id: user.id,
                status: "active",
                current_period_start: startDate.toISOString(),
                current_period_end: endDate.toISOString(),
                price_id: "plan_pro_monthly", // 예시
            }, { onConflict: "user_id" });

        if (subscriptionError) {
            console.error("Failed to update subscription:", subscriptionError);
            return NextResponse.json(
                { error: "Payment successful but subscription update failed." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, payment: paymentData });

    } catch (error: any) {
        console.error("Payment Confirmation Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
