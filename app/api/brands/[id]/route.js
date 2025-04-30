import db from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params: { id } }) {
  try {
    const brand = await db.brand.findUnique({
      where: {
        id,
      },
    });
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to fetch brand',
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const { title } = await request.json();
    const brand = await db.brand.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to update brand',
      },
      {
        status: 500,
      }
    );
  }
}
