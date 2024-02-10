import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { accessToken, refreshToken } = await req.json();

    const response = new NextResponse(JSON.stringify({ message: 'Cookies set' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    response.cookies.set('accessToken', accessToken, {
        path: '/',
        sameSite: 'strict',
        maxAge: 3600,
        secure: true,
    });
    response.cookies.set('refreshToken', refreshToken, {
        path: '/',
        sameSite: 'strict',
        maxAge: 7200,
        secure: true,
    });

    return response;
}