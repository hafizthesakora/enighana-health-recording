import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';

async function handleGetRequest(req, { params }) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        fitnessDoc: true,
        medicalDoc: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

async function handlePutRequest(req, { params }) {
  try {
    const { id } = params;
    const updates = await req.json();

    const updated = await prisma.user.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

async function handleDeleteRequest(req, { params }) {
  try {
    const { id } = params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGetRequest, ['ADMIN', 'HEALTH_TEAM']);
export const PUT = withAuth(handlePutRequest, ['ADMIN', 'HEALTH_TEAM']);
export const DELETE = withAuth(handleDeleteRequest, ['ADMIN']);
