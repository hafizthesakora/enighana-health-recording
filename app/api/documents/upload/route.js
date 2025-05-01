// app/api/documents/upload/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../../../lib/prisma';
import { withAuth } from '../../../../lib/middleware';

export const POST = withAuth(async (req) => {
  const formData = await req.formData();
  const userId = formData.get('userId');
  const fitness = formData.get('fitnessDoc');
  const medical = formData.get('medicalDoc');

  if (!userId) {
    return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
  }
  if (!fitness && !medical) {
    return NextResponse.json({ message: 'No files uploaded' }, { status: 400 });
  }

  const updateData = {};

  async function processFile(file, fieldName) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const outPath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(outPath, buffer);

    const doc = await prisma.document.create({
      data: {
        filename,
        originalName: file.name,
        fileType:
          fieldName === 'fitnessDoc' ? 'FITNESS_CERTIFICATE' : 'MEDICAL_RECORD',
        mimeType: file.type,
        size: file.size,
        uploadedBy: req.user.id,
        expiryDate:
          fieldName === 'fitnessDoc'
            ? new Date(formData.get('fitnessExpiry'))
            : null,
      },
    });

    if (fieldName === 'fitnessDoc') updateData.fitnessDocId = doc.id;
    if (fieldName === 'medicalDoc') updateData.medicalDocId = doc.id;
  }

  if (fitness) await processFile(fitness, 'fitnessDoc');
  if (medical) await processFile(medical, 'medicalDoc');

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return NextResponse.json({ message: 'Uploaded successfully', updated });
});
