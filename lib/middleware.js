import { NextResponse } from 'next/server';
import { verifyToken } from './auth';

export function withAuth(handler, allowedRoles = []) {
  return async (req, context) => {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    req.user = user;
    return handler(req, context);
  };
}
