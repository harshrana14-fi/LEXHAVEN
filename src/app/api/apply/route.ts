import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import * as admin from "firebase-admin";

// ✅ Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      token,
      internshipId,
      coverLetter,
      phone,
      linkedin,
      portfolio,
      startDate,
      resumeUrl,
    } = body;

    // 🔐 Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);
    if (!decoded?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Use service role client
    const supabase = supabaseServer();

    const { error } = await supabase.from("applications").insert({
      internship_id: internshipId,
      student_id: decoded.uid,
      cover_letter: coverLetter,
      phone,
      linkedin,
      portfolio,
      start_date: startDate,
      resume_url: resumeUrl,
      status: "pending",
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
