
import { createClient } from "@supabase/supabase-js";

// 주의: 이 클라이언트는 권한(RLS)을 무시하고 모든 데이터에 접근할 수 있습니다.
// 절대 클라이언트 사이드 코드(브라우저)에서 사용하지 마세요.
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!serviceRoleKey) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
