import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const AUTH_COOKIE_NAME = "hotel_cost_user";

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          message: "Thiếu ENV Supabase",
          hasSupabaseUrl: Boolean(supabaseUrl),
          hasServiceRoleKey: Boolean(serviceRoleKey),
          supabaseUrl,
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const userId = String(body.username ?? "").trim();
    const password = String(body.password ?? "").trim();

    if (!userId || !password) {
      return NextResponse.json(
        { message: "Thiếu user hoặc password" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: user, error } = await supabase
      .from("data_users")
      .select("user_id, user_name, password, status")
      .eq("user_id", userId)
      .eq("status", true)
      .limit(1)
      .maybeSingle();

    if (error) {
  console.error("LOGIN SUPABASE ERROR:", error);

  return NextResponse.json(
    {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    },
    { status: 500 }
  );
}

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy user active" },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        {
          message: "Sai user hoặc password",
          inputPasswordLength: password.length,
          dbPasswordLength: String(user.password).length,
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, user.user_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login server error";

    console.error("LOGIN API ERROR:", error);

    return NextResponse.json(
      {
        message,
      },
      { status: 500 }
    );
  }
}