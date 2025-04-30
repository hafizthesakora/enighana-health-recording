import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/view/${id}`;

    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 1,
      color: {
        dark: '#005A30', // ENI green color (can be adjusted)
        light: '#FFFFFF',
      },
    });

    return NextResponse.json({ qrCode: qrDataUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { message: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
