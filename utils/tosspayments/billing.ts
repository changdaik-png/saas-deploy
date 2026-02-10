
interface BillingPaymentParams {
    billingKey: string;
    customerKey: string;
    amount: number;
    orderId: string;
    orderName: string;
    customerEmail?: string;
}

export async function executeBillingPayment({
    billingKey,
    customerKey,
    amount,
    orderId,
    orderName,
    customerEmail,
}: BillingPaymentParams) {
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
        throw new Error("TOSS_SECRET_KEY is not defined");
    }

    const basicAuth = Buffer.from(`${secretKey}:`).toString("base64");

    const response = await fetch(
        `https://api.tosspayments.com/v1/billing/${billingKey}`,
        {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerKey,
                amount,
                orderId,
                orderName,
                customerEmail,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Billing payment failed");
    }

    return data;
}
