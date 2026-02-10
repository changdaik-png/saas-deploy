import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    // 환경 변수가 없으면 미들웨어를 건너뜀
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase env vars not found, skipping middleware.");
        return supabaseResponse;
    }

    try {
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        });

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

        // 3. 구독 체크 (노트 관련 경로만)
        if (user && (path.startsWith("/note") || path.startsWith("/notes"))) {
            try {
                const { data: subscription } = await supabase
                    .from("subscriptions")
                    .select("status, current_period_end")
                    .eq("user_id", user.id)
                    .single();

                if (subscription) {
                    const isActive = subscription.status === "active";
                    const isCanceledButValid =
                        subscription.status === "canceled" &&
                        new Date(subscription.current_period_end) > new Date();

                    if (isActive || isCanceledButValid) {
                        return supabaseResponse;
                    }
                }

                const url = request.nextUrl.clone();
                url.pathname = "/payment";
                return NextResponse.redirect(url);
            } catch {
                return supabaseResponse;
            }
        }

        return supabaseResponse;
    } catch (error) {
        console.error("Middleware error:", error);
        return supabaseResponse;
    }
}
