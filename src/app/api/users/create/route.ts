import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role for server-side only
);

export async function POST(req: Request) {
  try {
    const { token, userData } = await req.json();

    // ✅ Verify Firebase token
    const decoded = await getAuth().verifyIdToken(token);

    // ✅ Insert/update into Supabase
    const { error } = await supabase
      .from("users")
      .upsert({
        id: decoded.uid, // firebase uid
        email: decoded.email,
        full_name: userData.fullName,
        user_type: userData.userType,
        organization: userData.organization,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
