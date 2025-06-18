// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';

// export async function POST(request) {
//   try {
//     const { userId, pin } = await request.json();

//     if (!userId || !pin) {
//       return NextResponse.json(
//         { message: 'User ID and PIN are required' },
//         { status: 400 }
//       );
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 });
//     }

//     const isPinValid = user.pin === pin;

//     return NextResponse.json({ isValid: isPinValid });
//   } catch (error) {
//     console.error('Error verifying PIN:', error);
//     return NextResponse.json(
//       { message: 'Failed to verify PIN' },
//       { status: 500 }
//     );
//   }
// }

// app/api/verify-pin/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  const { userId, pin } = await request.json();
  if (!userId || !pin) {
    return NextResponse.json(
      { message: 'User ID and PIN are required' },
      { status: 400 }
    );
  }

  // Authenticate the caller (health‐team member)
  const raw = request.headers.get('authorization')?.split(' ')[1];
  const caller = verifyToken(raw);
  if (!caller) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const isValid = user.pin === pin;

  // If valid, log the access
  if (isValid) {
    await prisma.auditLog.create({
      data: {
        employeeId: userId,
        accessedById: caller.id,
        recordType: 'MEDICAL_RECORD',
        // accessedAt defaults to now()
      },
    });
  }

  return NextResponse.json({ isValid });
}
