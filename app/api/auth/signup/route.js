// app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';
import { generateToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { employeeId, name, email, password, department, role } =
      await request.json();

    // Basic validation
    if (!employeeId || !name || !email || !password || !department) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password too short' },
        { status: 400 }
      );
    }

    // Check existing user
    const existsByEmail = await prisma.user.findUnique({ where: { email } });
    const existsByEmpId = await prisma.user.findUnique({
      where: { employeeId },
    });
    if (existsByEmail) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    if (existsByEmpId) {
      return NextResponse.json(
        { message: 'Employee ID already in use' },
        { status: 400 }
      );
    }

    // Hash pw
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        employeeId, // now supplied by the client
        name,
        email,
        password: hashed,
        department,
        pin: Math.floor(1000 + Math.random() * 9000).toString(),
        role: role || 'HEALTH_TEAM',
      },
    });

    // Issue token
    const token = generateToken(user);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
