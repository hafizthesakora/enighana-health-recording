import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';

async function handleGetRequest() {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      include: {
        fitnessDoc: true,
        medicalDoc: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

async function handlePostRequest(req) {
  try {
    const { employeeId, name, email, department, typology, pin, role } =
      await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ employeeId }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Employee ID or email already exists' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        employeeId,
        name,
        email,
        department,
        typology, // ← new
        pin,
        role: role || 'EMPLOYEE',
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGetRequest, ['ADMIN', 'HEALTH_TEAM']);
export const POST = withAuth(handlePostRequest, ['ADMIN', 'HEALTH_TEAM']);
