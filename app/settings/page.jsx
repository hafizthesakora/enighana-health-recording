'use client';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import prisma from '@/lib/prisma';

export default async function SettingsPage() {
  // list Admin & Health-Team users
  const admins = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'HEALTH_TEAM'] } },
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="p-6 flex-1 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          <section className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Manage Admin & Health-Team
            </h2>
            <p className="text-gray-600 mb-4">
              Here are your current system users with elevated roles.
            </p>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {u.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">System Preferences</h2>
            <p className="text-gray-600">
              (Coming soon: configure JWT expiration, upload limits,
              notification settings, etc.)
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
