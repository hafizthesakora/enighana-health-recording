import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
  const { id } = params;
  const { pin } = await request.json();
  if (!pin) {
    return NextResponse.json({ message: 'PIN is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { pin: true },
  });
  if (!user) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ isValid: user.pin === pin });
}
