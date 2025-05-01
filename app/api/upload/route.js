// app/api/documents/upload/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../../lib/prisma';
import { withAuth } from '../../../lib/middleware';

export const POST = withAuth(async (req) => {
  const formData = await req.formData();
  const userId = formData.get('userId');
  if (!userId) {
    return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
  }

  const fitnessFile = formData.get('fitnessDoc');
  const medicalFile = formData.get('medicalDoc');
  if (!fitnessFile && !medicalFile) {
    return NextResponse.json({ message: 'No files uploaded' }, { status: 400 });
  }

  const updateData = {};
  // Helper to process one file
  async function handleOne(file, field) {
    const buf = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const out = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(out, buf);
    // create Document row
    const doc = await prisma.document.create({
      data: {
        filename,
        originalName: file.name,
        fileType:
          field === 'fitnessDoc' ? 'FITNESS_CERTIFICATE' : 'MEDICAL_RECORD',
        mimeType: file.type,
        size: file.size,
        uploadedBy: req.user.id,
      },
    });
    // assign to user
    if (field === 'fitnessDoc') updateData.fitnessDocId = doc.id;
    else updateData.medicalDocId = doc.id;
  }

  if (fitnessFile) await handleOne(fitnessFile, 'fitnessDoc');
  if (medicalFile) await handleOne(medicalFile, 'medicalDoc');

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return NextResponse.json({ message: 'Uploaded successfully', updated });
});
