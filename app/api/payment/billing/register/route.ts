import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";
import { executeBillingPayment } from "../../../../../utils/tosspayments/billing";

export async function POST(req: NextRequest) {
    const { authKey, customerKey } = await req.json();

    if (!authKey || !customerKey) {
        return NextResponse.json(
            { error: "Missing required parameters" },
            { status: 400 }
        );
    }

    const supabase = createClient();
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

    const basicAuth = Buffer.from(`${secretKey}:`).toString("base64");

    try {
        // 1. 빌링키 발급 (카드 등록 완료)
        const issueResponse = await fetch("https://api.tosspayments.com/v1/billing/authorizations/issue", {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authKey,
                customerKey,
            }),
        });

        const issueData = await issueResponse.json();

        if (!issueResponse.ok) {
            console.error("Billing Key Issue Failed:", issueData);
            return NextResponse.json(
                { error: issueData.message || "Failed to issue billing key" },
                { status: issueResponse.status }
            );
        }

        const billingKey = issueData.billingKey;

        // 2. 첫 정기 결제 즉시 실행 (9,900원)
        const orderId = `ORDER_BILLING_${new Date().getTime()}`;
        const amount = 9900;
        const orderName = "CloudNote Pro - 월간 정기 구독";

        try {
            // 유틸리티 함수 사용하여 결제 실행
            const paymentData = await executeBillingPayment({
                billingKey,
                customerKey,
                amount,
                orderId,
                orderName,
                customerEmail: user.email,
            });

            // 3. 결제 성공 시 DB 저장

            // 3-1. Payments 테이블에 결제 이력 저장
            await supabase.from("payments").insert({
                user_id: user.id,
                payment_key: paymentData.paymentKey,
                order_id: orderId,
                amount: amount,
                status: "DONE",
                method: "BILLING", // 정기결제
                receipt_url: paymentData.receipt?.url,
                approved_at: paymentData.approvedAt,
            });

            // 3-2. Subscriptions 테이블 업데이트 (빌링키 저장 + 다음 결제일 설정)
            const startDate = new Date();
            const nextPaymentDate = new Date();
            nextPaymentDate.setDate(nextPaymentDate.getDate() + 30); // 30일 후

            const { error: subError } = await supabase.from("subscriptions").upsert({
                user_id: user.id,
                status: "active",
                price_id: "plan_pro_monthly",
                billing_key: billingKey,
                current_period_start: startDate.toISOString(),
                current_period_end: nextPaymentDate.toISOString(),
                next_payment_date: nextPaymentDate.toISOString(),
            }, { onConflict: "user_id" });

            if (subError) {
                console.error("Subscription update failed:", subError);
            }

            return NextResponse.json({ success: true, payment: paymentData });

        } catch (paymentError: any) {
            // 빌링키는 발급되었으나 첫 결제 실패 -> 사용자에게 알림 필요
            console.error("First Billing Payment Failed:", paymentError);
            return NextResponse.json(
                { error: paymentError.message || "Billing key issued but payment failed" },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error("Billing Registration Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
