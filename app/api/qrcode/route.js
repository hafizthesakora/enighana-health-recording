import QRCode from 'qrcode';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const target = `${process.env.NEXT_PUBLIC_BASE_URL}/view/${userId}`;
  const qr = await QRCode.toDataURL(target);
  return NextResponse.json({ qr });
}
