export const dynamic = 'force-dynamic';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import prisma from '@/lib/prisma';

export default async function ReportsPage() {
  // server‐side aggregates
  const totalEmployees = await prisma.user.count({
    where: { role: 'EMPLOYEE' },
  });
  const totalFitness = await prisma.document.count({
    where: { fileType: 'FITNESS_CERTIFICATE' },
  });
  const totalMedical = await prisma.document.count({
    where: { fileType: 'MEDICAL_RECORD' },
  });

  const typologyCounts = await prisma.user.groupBy({
    by: ['typology'],
    where: { role: 'EMPLOYEE' },
    _count: { typology: true },
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="p-6 flex-1 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Reports</h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Employees', value: totalEmployees },
              { label: 'Fitness Certificates', value: totalFitness },
              { label: 'Medical Records', value: totalMedical },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-5 rounded-lg shadow">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Employees by Typology
            </h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Typology
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {typologyCounts.map((t) => (
                  <tr key={t.typology}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.typology ? t.typology.split('_').join(' ') : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t._count.typology}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
