import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";

export const dynamic = "force-dynamic";

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen text-lg font-medium text-slate-600">
                로딩 중...
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
