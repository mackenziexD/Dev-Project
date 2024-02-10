import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {

    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
}