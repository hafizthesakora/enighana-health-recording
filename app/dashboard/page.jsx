'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    fitnessDocuments: 0,
    medicalDocuments: 0,
    expiringSoon: 0,
  });
  const [expiringSoonList, setExpiringSoonList] = useState([]);

  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No auth token found');
        }

        const usersResponse = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }

        const users = await usersResponse.json();

        // Calculate stats
        const totalEmployees = users.length;
        const fitnessDocuments = users.filter(
          (user) => user.fitnessDocId
        ).length;
        const medicalDocuments = users.filter(
          (user) => user.medicalDocId
        ).length;

        // Real expiring-soon logic: within 30 days
        const now = Date.now();
        const cutoff = now + 30 * 24 * 60 * 60 * 1000;
        const expiring = users
          .filter(
            (u) =>
              u.fitnessDoc?.expiryDate &&
              new Date(u.fitnessDoc.expiryDate).getTime() <= cutoff
          )
          .map((u) => ({
            id: u.id,
            name: u.name,
            employeeId: u.employeeId,
            fitnessDoc: u.fitnessDoc,
            daysLeft: Math.ceil(
              (new Date(u.fitnessDoc.expiryDate).getTime() - now) /
                (1000 * 60 * 60 * 24)
            ),
          }));

        setStats({
          totalEmployees,
          fitnessDocuments,
          medicalDocuments,
          expiringSoon: expiring.length, // for your small stat card, you can still show the count
        });

        setExpiringSoonList(expiring);

        // Get recent document uploads
        const documents = [];
        users.forEach((user) => {
          if (user.fitnessDoc) {
            documents.push({
              id: user.fitnessDoc.id,
              userId: user.id,
              employeeId: user.employeeId,
              employeeName: user.name,
              documentType: 'Fitness Certificate',
              uploadDate: new Date(user.fitnessDoc.uploadDate),
              fileName: user.fitnessDoc.originalName,
            });
          }

          if (user.medicalDoc) {
            documents.push({
              id: user.medicalDoc.id,
              userId: user.id,
              employeeId: user.employeeId,
              employeeName: user.name,
              documentType: 'Medical Record',
              uploadDate: new Date(user.medicalDoc.uploadDate),
              fileName: user.medicalDoc.originalName,
            });
          }
        });

        // Sort by upload date and take the latest 5
        const recentDocs = documents
          .sort((a, b) => b.uploadDate - a.uploadDate)
          .slice(0, 5);

        setRecentUploads(recentDocs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <Link href="/employees/add">
                <Button>Add New Employee</Button>
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                          <svg
                            className="h-6 w-6 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Employees
                            </dt>
                            <dd>
                              <div className="text-lg font-bold text-gray-900">
                                {stats.totalEmployees}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                          <svg
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Fitness Certificates
                            </dt>
                            <dd>
                              <div className="text-lg font-bold text-gray-900">
                                {stats.fitnessDocuments}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-purple-100 p-3">
                          <svg
                            className="h-6 w-6 text-purple-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Medical Records
                            </dt>
                            <dd>
                              <div className="text-lg font-bold text-gray-900">
                                {stats.medicalDocuments}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-red-100 p-3">
                          <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Certificates Expiring Soon
                            </dt>
                            <dd>
                              <div className="text-lg font-bold text-gray-900">
                                {stats.expiringSoon}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Document Uploads
                    </h3>
                  </div>

                  <div className="bg-white divide-y divide-gray-200">
                    {recentUploads.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Employee
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Document Type
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              File Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Upload Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentUploads.map((doc) => (
                            <tr key={doc.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {doc.employeeName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {doc.employeeId}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    doc.documentType === 'Fitness Certificate'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}
                                >
                                  {doc.documentType}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {doc.fileName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {doc.uploadDate.toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  href={`/view/${doc.userId}`}
                                  className="text-green-600 hover:text-green-900 mr-4"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No recent document uploads
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg mb-8">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Upcoming FTW Expirations
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    {expiringSoonList.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Employee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Expiry Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Days Left
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {expiringSoonList.map((u) => (
                            <tr key={u.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {u.name} (ID: {u.employeeId})
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  u.fitnessDoc.expiryDate
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                {u.daysLeft} days
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  href={`/employees`}
                                  className="text-green-600 hover:underline"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="p-6 text-gray-500">
                        No FTW certificates expiring in the next 30 days.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
