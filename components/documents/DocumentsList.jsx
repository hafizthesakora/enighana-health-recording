'use client';
import { useState } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';

export default function DocumentsList({ documents }) {
  const [docs, setDocs] = useState(documents);

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return;
    await fetch(`/api/documents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setDocs(docs.filter((d) => d.id !== id));
  };

  const handleReplace = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: fd,
    });
    if (res.ok) {
      const updated = await res.json();
      setDocs(docs.map((d) => (d.id === id ? updated.document : d)));
    } else {
      alert('Failed to replace document');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Typology
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Uploaded
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {docs.map((doc) => {
            const user = doc.userFitness[0] || doc.userMedical[0] || {};
            const docType =
              doc.fileType === 'FITNESS_CERTIFICATE' ? 'Fitness' : 'Medical';
            return (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.name} (ID: {user.employeeId})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.typology ? user.typology.split('_').join(' ') : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {docType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {doc.uploadedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <Link
                    href={`/view/${user.id}`}
                    className="text-green-600 hover:underline"
                  >
                    View
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </Button>
                  <label className="text-blue-600 hover:underline cursor-pointer">
                    Replace
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleReplace(e, doc.id)}
                    />
                  </label>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
