'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import PinModal from '@/components/PinModal';
import { useRouter } from 'next/navigation';

export default function ScanViewPage({ params }) {
  const userId = params.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [medicalVisible, setMedicalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('fitness'); // For mobile tab switching
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/public/users/${userId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject('Not found')))
      .then(setUser)
      .catch((msg) => setError(msg))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex flex-col p-2 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 px-2 sm:px-0">
          {user.name}'s Documents
        </h1>

        {/* Mobile Tab Navigation */}
        <div className="flex md:hidden mb-4 bg-white rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab('fitness')}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-l-lg transition-colors ${
              activeTab === 'fitness'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Fitness to Work
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-r-lg transition-colors ${
              activeTab === 'medical'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Medical Records
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-1 gap-6">
          {/* FTW Section */}
          <section className="flex-1 flex flex-col min-h-0">
            <h2 className="font-medium mb-2">Fitness to Work</h2>
            {user.fitnessDoc?.filename ? (
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe
                  src={`/uploads/${user.fitnessDoc.filename}`}
                  className="w-full h-full border-0"
                  style={{ minHeight: '600px' }}
                  title="Fitness to Work Document"
                />
              </div>
            ) : (
              <div className="flex-1 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <p className="text-gray-500">No FTW uploaded.</p>
              </div>
            )}
          </section>

          {/* Medical Section */}
          <section className="flex-1 flex flex-col min-h-0">
            <h2 className="font-medium mb-2">Medical Records</h2>
            {medicalVisible ? (
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe
                  src={`/uploads/${user.medicalDoc.filename}`}
                  className="w-full h-full border-0"
                  style={{ minHeight: '600px' }}
                  title="Medical Records Document"
                />
              </div>
            ) : user.medicalDoc?.filename ? (
              <div className="flex-1 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <Button onClick={() => setShowPin(true)}>
                  Enter PIN to View
                </Button>
              </div>
            ) : (
              <div className="flex-1 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <p className="text-gray-500">No medical record uploaded.</p>
              </div>
            )}
          </section>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden flex-1 flex-col min-h-0">
          {activeTab === 'fitness' && (
            <section className="flex-1 flex flex-col min-h-0">
              {user.fitnessDoc?.filename ? (
                <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                  <iframe
                    src={`/uploads/${user.fitnessDoc.filename}`}
                    className="w-full h-full border-0"
                    style={{ minHeight: 'calc(100vh - 200px)' }}
                    title="Fitness to Work Document"
                  />
                </div>
              ) : (
                <div className="flex-1 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <p className="text-gray-500">No FTW uploaded.</p>
                </div>
              )}
            </section>
          )}

          {activeTab === 'medical' && (
            <section className="flex-1 flex flex-col min-h-0">
              {medicalVisible ? (
                <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                  <iframe
                    src={`/uploads/${user.medicalDoc.filename}`}
                    className="w-full h-full border-0"
                    style={{ minHeight: 'calc(100vh - 200px)' }}
                    title="Medical Records Document"
                  />
                </div>
              ) : user.medicalDoc?.filename ? (
                <div className="flex-1 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <Button onClick={() => setShowPin(true)}>
                    Enter PIN to View
                  </Button>
                </div>
              ) : (
                <div className="flex-1 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <p className="text-gray-500">No medical record uploaded.</p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {showPin && (
        <PinModal
          onVerify={async (pin) => {
            const res = await fetch(`/api/public/users/${userId}/verify-pin`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pin }),
            });
            const { isValid } = await res.json();
            if (isValid) {
              setMedicalVisible(true);
              setShowPin(false);
            } else {
              alert('Invalid PIN');
            }
          }}
          onCancel={() => setShowPin(false)}
        />
      )}
    </div>
  );
}
