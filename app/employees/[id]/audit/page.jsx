'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/ui/Button';

export default function AuditPage() {
  const params = useSearchParams();
  const employeeId = params.get('id');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) return;
    const token = localStorage.getItem('token');
    fetch(`/api/audit-logs?employeeId=${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setLogs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [employeeId]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="p-6 overflow-y-auto flex-1">
          <h1 className="text-2xl font-bold mb-4">Audit Trail</h1>

          {loading ? (
            <p>Loading…</p>
          ) : logs.length === 0 ? (
            <p>No access events recorded.</p>
          ) : (
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="px-4 py-2">When</th>
                  <th className="px-4 py-2">By</th>
                  <th className="px-4 py-2">Record Type</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {new Date(log.accessedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {log.accessedBy.name || log.accessedBy.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {log.recordType.replace('_', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}
