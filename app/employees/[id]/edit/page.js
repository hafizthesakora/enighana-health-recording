// app/employees/[id]/edit/page.js
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import EditEmployeeForm from '@/components/employees/EditEmployeeForm';
import prisma from '@/lib/prisma';

export default async function EditEmployeePage({ params }) {
  const { id } = params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      employeeId: true,
      name: true,
      email: true,
      department: true,
      typology: true,
      pin: true,
    },
  });
  if (!user) {
    return <p className="p-6">Employee not found.</p>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="p-6 flex-1 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>
          <EditEmployeeForm initialData={user} />
        </main>
      </div>
    </div>
  );
}
