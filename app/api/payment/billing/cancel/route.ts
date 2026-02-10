import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function POST(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 구독 정보 업데이트
        // 1. status -> 'canceled' (취소됨)
        // 2. billing_key -> null (더 이상 자동결제 안 함)
        // 3. next_payment_date -> null (다음 결제 예정 없음)
        // 4. 하지만 current_period_end는 유지됨 (남은 기간 동안 혜택 제공)

        const { error } = await supabase
            .from("subscriptions")
            .update({
                status: "canceled",
                billing_key: null,
                next_payment_date: null,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id);

        if (error) {
            console.error("Subscription Cancel Error:", error);
            return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Subscription Cancel Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
