import PaymentSuccessContent from "./PaymentSuccessContent";

export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;

    return (
        <PaymentSuccessContent
            authKey={(params.authKey as string) || null}
            customerKey={(params.customerKey as string) || null}
            paymentKey={(params.paymentKey as string) || null}
            orderId={(params.orderId as string) || null}
            amount={(params.amount as string) || null}
        />
    );
}
