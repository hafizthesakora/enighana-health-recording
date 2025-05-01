// app/api/documents/[id]/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';

// DELETE /api/documents/:id
export const DELETE = withAuth(async (req, { params }) => {
  const { id } = params;
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  // delete file from disk
  const filePath = path.join(process.cwd(), 'public', 'uploads', doc.filename);
  await unlink(filePath).catch(() => {
    /* ignore if missing */
  });

  // disconnect from any user
  await prisma.user.updateMany({
    where: { fitnessDocId: id },
    data: { fitnessDocId: null },
  });
  await prisma.user.updateMany({
    where: { medicalDocId: id },
    data: { medicalDocId: null },
  });

  // delete DB record
  await prisma.document.delete({ where: { id } });

  return NextResponse.json({ message: 'Deleted' });
});

// PUT /api/documents/:id (replace file)
export const PUT = withAuth(async (req, { params }) => {
  const { id } = params;
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file) {
    return NextResponse.json({ message: 'No file provided' }, { status: 400 });
  }

  const old = await prisma.document.findUnique({ where: { id } });
  if (!old) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  // delete old file
  const oldPath = path.join(process.cwd(), 'public', 'uploads', old.filename);
  await unlink(oldPath).catch(() => {});

  // save new file
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name);
  const newName = `${Date.now()}-${id}${ext}`;
  const out = path.join(process.cwd(), 'public', 'uploads', newName);
  await fs.promises.writeFile(out, buffer);

  // update record
  const updated = await prisma.document.update({
    where: { id },
    data: {
      filename: newName,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadDate: new Date(),
    },
  });

  return NextResponse.json({ message: 'Replaced', document: updated });
});
