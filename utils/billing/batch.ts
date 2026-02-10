import { createAdminClient } from "../supabase/admin";
import { executeBillingPayment } from "../tosspayments/billing";

/**
 * 오늘 결제해야 하는 사용자를 조회하고 순차적으로 결제를 실행합니다.
 * 이 함수는 Vercel Cron Job이나 스케줄러에서 주기적으로(매일) 호출해야 합니다.
 */
export async function processDuePayments() {
    const supabase = createAdminClient();

    // KST 기준 '오늘' 날짜 구하기 (YYYY-MM-DD)
    // 서버 시간대가 UTC일 수 있으므로 9시간을 더해 KST로 변환
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const todayString = kstDate.toISOString().split("T")[0]; // YYYY-MM-DD

    console.log(`[Batch] Starting processDuePayments for date: ${todayString} (KST)...`);

    const customerKeyPrefix = process.env.NEXT_PUBLIC_TOSS_CUSTOMER_KEY_PREFIX || "USER_";

    // 1. 조회: 상태가 'active'이면서 다음 결제일이 오늘(또는 과거)인 구독 정보 가져오기
    // next_payment_date 컬럼이 timestamptz라면 날짜 비교가 까다로울 수 있습니다.
    // 여기서는 YYYY-MM-DD 형식의 문자열 비교를 위해 lte 조건을 사용하되, 
    // 타임스탬프가 "내일 00:00:00 KST"보다 작은 것들을 찾습니다.

    const tomorrowKst = new Date(kstDate);
    tomorrowKst.setDate(tomorrowKst.getDate() + 1);
    const searchLimitDate = tomorrowKst.toISOString().split("T")[0]; // 내일 날짜 YYYY-MM-DD

    // 예: 오늘이 2월 10일이면, searchLimitDate는 2월 11일.
    // next_payment_date < '2026-02-11' 인 것들 조회 (즉 2월 10일 23:59:59까지)
    const { data: overdueSubscriptions, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("status", "active")
        .lt("next_payment_date", searchLimitDate);

    if (error) {
        console.error("[Batch] Failed to fetch subscriptions:", error);
        throw error;
    }

    if (!overdueSubscriptions || overdueSubscriptions.length === 0) {
        console.log("[Batch] No payments due today.");
        return { processed: 0, success: 0, failed: 0 };
    }

    console.log(`[Batch] Found ${overdueSubscriptions.length} subscriptions to process.`);

    let successCount = 0;
    let failCount = 0;

    // 2. 순차적으로 결제 실행
    for (const sub of overdueSubscriptions) {
        try {
            if (!sub.billing_key) {
                console.warn(`[Batch] Skipped subscription ${sub.id}: No billing key.`);
                failCount++;
                continue;
            }

            // 유저 이메일 조회
            const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(sub.user_id);

            if (userError || !user) {
                console.warn(`[Batch] Skipped subscription ${sub.id}: User not found.`);
                failCount++;
                continue;
            }

            const amount = 9900;
            const orderId = `ORDER_RECURRING_${sub.id}_${Date.now()}`;
            const orderName = "CloudNote Pro - 정기 월간 결제";
            const customerKey = `${customerKeyPrefix}${sub.user_id}`;

            console.log(`[Batch] Processing payment for user ${sub.user_id} (${orderId})...`);

            // 2-1. 토스페이먼츠 결제 실행
            const paymentData = await executeBillingPayment({
                billingKey: sub.billing_key,
                customerKey,
                amount,
                orderId,
                orderName,
                customerEmail: user.email,
            });

            // 2-2. 결제 성공: DB 업데이트
            await supabase.from("payments").insert({
                user_id: sub.user_id,
                payment_key: paymentData.paymentKey,
                order_id: orderId,
                amount,
                status: "DONE",
                method: "BILLING",
                receipt_url: paymentData.receipt?.url,
                approved_at: paymentData.approvedAt,
            });

            // 다음 결제일 계산 (정확히 1달 뒤)
            // 기존 next_payment_date를 기준으로 계산해야 밀리지 않음
            // 만약 next_payment_date가 없다면 오늘(KST) 기준
            const baseDate = sub.next_payment_date ? new Date(sub.next_payment_date) : new Date(todayString);

            // 1달 더하기 로직
            // 주의: setMonth 사용 시 1월 31일 -> 2월 28/29일 처리 필요
            const nextDate = new Date(baseDate);
            const currentDay = baseDate.getDate();
            nextDate.setMonth(nextDate.getMonth() + 1);

            // 날짜 보정: 1월 31일의 1달 뒤가 3월 3일이 되면 -> 2월 28일로 변경
            if (nextDate.getDate() !== currentDay) {
                nextDate.setDate(0); // 전달의 마지막 날로 설정 (즉, 2월 28/29일)
            }

            await supabase
                .from("subscriptions")
                .update({
                    current_period_start: new Date().toISOString(),
                    current_period_end: nextDate.toISOString(),
                    next_payment_date: nextDate.toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq("id", sub.id);

            console.log(`[Batch] Payment success for user ${sub.user_id}. Next due: ${nextDate.toISOString()}`);
            successCount++;

        } catch (err: any) {
            console.error(`[Batch] Payment failed for subscription ${sub.id}:`, err.message);

            await supabase
                .from("subscriptions")
                .update({
                    status: "past_due",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", sub.id);

            failCount++;
        }
    }

    console.log(`[Batch] Completed. Success: ${successCount}, Failed: ${failCount}`);
    return { processed: overdueSubscriptions.length, success: successCount, failed: failCount };
}
