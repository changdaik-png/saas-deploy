import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    // Check if supabaseResponse is already modified (not typical in this snippet, but good for safety)
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // 1. 비로그인 사용자: 보호된 라우트 접근 시 로그인 페이지로 리다이렉트
    if (
        !user &&
        (path.startsWith("/dashboard") ||
            path.startsWith("/note") ||
            path.startsWith("/payment") ||
            path.startsWith("/notes"))
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // 2. 로그인 사용자: 로그인/회원가입 페이지 접근 시 대시보드로 이동
    if (user && (path.startsWith("/login") || path.startsWith("/signup"))) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    // 3. 로그인 했지만 구독이 없는 사용자 및 권한 테스트
    if (user && (path.startsWith("/note") || path.startsWith("/notes"))) {
        // [TESTING ONLY] test2@test.com 계정은 무조건 구독자로 간주 (Mocking)
        if (user.email === "test2@test.com") {
            return supabaseResponse; // 통과
        }

        // [TESTING ONLY] test1@test.com 계정은 무조건 미구독자로 간주
        if (user.email === "test1@test.com") {
            const url = request.nextUrl.clone();
            url.pathname = "/payment";
            return NextResponse.redirect(url);
        }

        try {
            // 실제 DB 조회 (테이블이 없으면 에러 발생 가능하므로 try-catch)
            const { data: subscription } = await supabase
                .from("subscriptions")
                .select("status")
                .eq("user_id", user.id)
                .in("status", ["active", "trialing"])
                .single();

            if (!subscription) {
                /* subscription check disabled temporarily if table doesn't exist for general users 
                   But since we are precise testing test1/test2, this block is less critical for them.
                   We keep the logic for others. 
                */
                const url = request.nextUrl.clone();
                url.pathname = "/payment";
                return NextResponse.redirect(url);
            }
        } catch (error) {
            // 테이블이 없거나 에러 발생 시 안전하게 결제 페이지로 이동 or 통과 (정책에 따라 다름)
            // 여기서는 안전하게 결제로 보냄
            console.error("Subscription check failed:", error);
            const url = request.nextUrl.clone();
            url.pathname = "/payment";
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
