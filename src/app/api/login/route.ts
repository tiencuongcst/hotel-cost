import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "hotel_cost_user";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "").trim();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Thiếu user hoặc password" },
        { status: 400 }
      );
    }

    if (username !== "admin" || password !== "admin123") {
      return NextResponse.json(
        { message: "Sai user hoặc password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login success",
    });

    response.cookies.set(AUTH_COOKIE_NAME, username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);

    return NextResponse.json(
      { message: "Login server error" },
      { status: 500 }
    );
  }
}