'use client';
import { useState } from 'react';
import Button from './ui/Button';

export default function PinModal({ onVerify, onCancel }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!pin || pin.length < 4) {
      setError('Please enter a valid PIN');
      return;
    }

    onVerify(pin);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Enter Medical Record PIN
        </h2>
        <p className="mb-4 text-gray-600">
          Please enter the employee's PIN to access their medical records.
        </p>

        <div className="mb-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError('');
            }}
            placeholder="Enter PIN"
            className={`w-full border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-md p-2 text-center text-2xl tracking-widest`}
            maxLength={4}
            autoFocus
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
}
