import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId, pin } = await request.json();

    if (!userId || !pin) {
      return NextResponse.json(
        { message: 'User ID and PIN are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isPinValid = user.pin === pin;

    return NextResponse.json({ isValid: isPinValid });
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return NextResponse.json(
      { message: 'Failed to verify PIN' },
      { status: 500 }
    );
  }
}
