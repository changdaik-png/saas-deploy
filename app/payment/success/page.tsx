import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";

export const dynamic = "force-dynamic";

export default function PaymentSuccessPage() {
    try {
        return (
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen text-lg font-medium text-slate-600">
                    로딩 중...
                </div>
            }>
                <PaymentSuccessContent />
            </Suspense>
        );
    } catch (error) {
        console.error("Payment failure:", error);
        return (
            <div className="flex items-center justify-center min-h-screen text-lg font-medium text-red-500">
                결제 결과를 불러오는 중 오류가 발생했습니다.
            </div>
        );
    }
}
