// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { auth } from "./firebase";

// ✅ Base values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ✅ Public client (safe for frontend, browsing data with anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Authenticated client (attaches Firebase JWT for RLS)
export const getSupabaseWithAuth = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return supabase;

  const token = await currentUser.getIdToken(/* forceRefresh */ true);

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

// ✅ Server-side client (⚠️ uses service role key → NEVER import in client code)
export const supabaseServer = () => {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }, // no local session storage
  });
};
