import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { filename } = params;

    // Find the document by filename
    const document = await prisma.document.findFirst({
      where: { filename: filename },
    });

    if (!document) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    if (!document.fileData) {
      return NextResponse.json(
        { error: 'File data not available' },
        { status: 404 }
      );
    }

    // Convert base64 back to buffer
    const fileBuffer = Buffer.from(document.fileData, 'base64');

    // Set appropriate headers
    const headers = new Headers();
    headers.set(
      'Content-Type',
      document.mimeType || 'application/octet-stream'
    );
    headers.set('Content-Length', document.size.toString());
    headers.set(
      'Content-Disposition',
      `inline; filename="${document.originalName}"`
    );

    // Add CORS headers for public access
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET');
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
