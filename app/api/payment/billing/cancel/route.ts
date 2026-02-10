import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function POST(req: NextRequest) {
    console.log("Canceling subscription request received");
    const supabase = await createClient();

    // (auth.getUser 이전에 세션 확인 필요할 수 있음)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Auth error:", authError);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`Canceling subscription for user: ${user.id}`);

    try {
        // 이미 취소된 상태인지 확인 (옵션)

        // 구독 정보 업데이트
        const { error } = await supabase
            .from("subscriptions")
            .update({
                status: "canceled",
                // billing_key: null, // 나중에 재구독 시 billing key 재사용할 수도 있으므로 null 처리 신중히 (여기선 일단 null)
                // next_payment_date: null, // 다음 결제 없음
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id);

        if (error) {
            console.error("Subscription Cancel DB Error:", error);
            return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
        }

        console.log("Subscription canceled successfully");
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Subscription Cancel Exception:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
