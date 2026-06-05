import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const userId = String(body.user_id || '').trim();
    const password = String(body.password || '').trim();

    if (!userId || !password) {
      return NextResponse.json(
        { message: 'Thiếu user hoặc password' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc('rpc_login_user', {
      p_user_id: userId,
      p_password: password,
    });

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    const user = data?.[0];

    if (!user) {
      return NextResponse.json(
        { message: 'User hoặc password không đúng' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      user_id: user.user_id,
      user_name: user.user_name,
    });

    response.cookies.set('hotel_cost_user', user.user_id, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
}