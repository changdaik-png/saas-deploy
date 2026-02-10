import { NextRequest, NextResponse } from "next/server";
import { processDuePayments } from "../../../../utils/billing/batch";

export async function GET(req: NextRequest) {
    // 보안: Vercel Cron Job에서 호출했는지 확인 (Authorization 헤더 검사)
    // 로컬 테스트를 위해 임시로 비활성화하거나, 특정 쿼리 파라미터로 우회할 수도 있음.
    // 실제 배포 시에는 CRON_SECRET 환경 변수를 사용하여 검증하는 것이 좋습니다.
    // 예: if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) ...

    try {
        const result = await processDuePayments();
        return NextResponse.json({
            message: "Billing batch process completed",
            ...result
        });
    } catch (error: any) {
        console.error("Cron Job Failed:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
