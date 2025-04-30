// app/documents/page.js
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import DocumentsList from '@/components/documents/DocumentsList';
import prisma from '@/lib/prisma';

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    include: {
      userFitness: true,
      userMedical: true,
    },
    orderBy: { uploadDate: 'desc' },
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="p-6 flex-1 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">All Documents</h1>
          <DocumentsList documents={documents} />
        </main>
      </div>
    </div>
  );
}
