// app/employees/page.js
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import EmployeesList from '@/components/employees/EmployeesList';
import prisma from '@/lib/prisma';

export default async function EmployeesPage() {
  // Server fetch—no client fetch or useEffect needed
  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    include: { fitnessDoc: true, medicalDoc: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <EmployeesList employees={employees} />
        </main>
      </div>
    </div>
  );
}
