// File: app/documents/upload/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/layout/Header';
import Sidebar from '../../../components/layout/Sidebar';
import Button from '../../../components/ui/Button';

export default function UploadDocumentsPage() {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [fitnessFile, setFitnessFile] = useState(null);
  const [fitnessExpiry, setFitnessExpiry] = useState('');
  const [medicalFile, setMedicalFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If not logged in, kick to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // If no employeeId in URL, show a message
  if (!employeeId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-600">
          No employee selected. Go back and click “Upload” next to an employee.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fitnessFile && !medicalFile) {
      setError('Please select at least one document to upload.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      // MUST include this key exactly as the API expects
      formData.append('userId', employeeId);
      if (fitnessFile) {
        formData.append('fitnessExpiry', fitnessExpiry);
        formData.append('fitnessDoc', fitnessFile);
      }
      if (medicalFile) formData.append('medicalDoc', medicalFile);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // NOTE: DO NOT set Content-Type here, let the browser add the correct multipart boundary
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      // On success, go back to the employees list
      router.push('/employees');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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

        <main className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-xl font-bold mb-4">Upload Documents</h1>

            {error && <div className="mb-4 text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Fitness to Work Certificate
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => setFitnessFile(e.target.files[0])}
                  className="w-full"
                />

                <label className="block mt-2 mb-1 font-medium text-gray-700">
                  FTW Expiry Date
                </label>
                <input
                  type="date"
                  onChange={(e) => setFitnessExpiry(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Medical Records
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => setMedicalFile(e.target.files[0])}
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Uploading…' : 'Upload'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
