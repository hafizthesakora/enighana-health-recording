'use client';
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
      <main className="flex-1 flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-4">{user.name}’s Documents</h1>

        <div className="flex-1 flex flex-col md:flex-row gap-6">
          {/* FTW */}
          <section className="flex-1 flex flex-col">
            <h2 className="font-medium mb-2">Fitness to Work</h2>
            {user.fitnessDoc?.filename ? (
              <iframe
                src={`/uploads/${user.fitnessDoc.filename}`}
                className="flex-1 w-full border"
                style={{ minHeight: 0 }}
              />
            ) : (
              <p className="text-gray-500">No FTW uploaded.</p>
            )}
          </section>

          {/* Medical */}
          <section className="flex-1 flex flex-col">
            <h2 className="font-medium mb-2">Medical Records</h2>
            {medicalVisible ? (
              <iframe
                src={`/uploads/${user.medicalDoc.filename}`}
                className="flex-1 w-full border"
                style={{ minHeight: 0 }}
              />
            ) : user.medicalDoc?.filename ? (
              <Button onClick={() => setShowPin(true)}>
                Enter PIN to View
              </Button>
            ) : (
              <p className="text-gray-500">No medical record uploaded.</p>
            )}
          </section>
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
