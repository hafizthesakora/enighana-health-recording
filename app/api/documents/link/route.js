// app/api/documents/link/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req) {
  const {
    employeeId,
    url,
    originalName,
    mimeType,
    size,
    documentType,
    expiryDate,
  } = await req.json();

  if (!employeeId || !url || !documentType) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const doc = await prisma.document.create({
    data: {
      url,
      originalName,
      fileType: documentType,
      mimeType,
      size: size || null,
      uploadedBy: employeeId, // or req.user.id if you want uploader
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      ...(documentType === 'FITNESS_CERTIFICATE'
        ? { userFitness: { connect: { id: employeeId } } }
        : { userMedical: { connect: { id: employeeId } } }),
    },
  });

  return NextResponse.json(doc);
}
