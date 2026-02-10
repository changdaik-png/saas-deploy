import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";

export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // searchParams를 받음으로써 Next.js가 이 페이지를 정적 생성하지 않음
    const params = await searchParams;

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
