import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    try {
        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
    
        if (response.ok) {
            const data = await response.json();
            return NextResponse.json(data, { status: 200 });
        }
    
        return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
    }
}
