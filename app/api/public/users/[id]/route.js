// No auth here—public endpoint
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      fitnessDoc: { select: { filename: true } },
      medicalDoc: { select: { filename: true } },
    },
  });
  if (!user) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}
