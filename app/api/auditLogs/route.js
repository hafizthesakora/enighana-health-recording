// app/api/audit-logs/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';

// only ADMIN or HEALTH_TEAM can view logs
async function GET(request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  if (!employeeId) {
    return NextResponse.json(
      { message: 'employeeId is required' },
      { status: 400 }
    );
  }

  const logs = await prisma.auditLog.findMany({
    where: { employeeId },
    include: {
      accessedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { accessedAt: 'desc' },
  });

  return NextResponse.json(logs);
}

export const GET = withAuth(GET, ['ADMIN', 'HEALTH_TEAM']);
