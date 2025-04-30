'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function EditEmployeeForm({ initialData }) {
  const [form, setForm] = useState({ ...initialData });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${form.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: form.employeeId,
          name: form.name,
          email: form.email,
          department: form.department,
          typology: form.typology,
          pin: form.pin,
        }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Update failed');
      }
      router.push('/employees');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      <Input
        label="Employee ID"
        name="employeeId"
        value={form.employeeId}
        onChange={handleChange}
      />
      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        label="Department"
        name="department"
        value={form.department}
        onChange={handleChange}
      />

      <div className="mb-4">
        <label
          htmlFor="typology"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Typology
        </label>
        <select
          id="typology"
          name="typology"
          value={form.typology}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Select…</option>
          <option value="PERMANENT">Permanent</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERN">Intern</option>
          <option value="NATIONAL_SERVICE">National Service</option>
        </select>
      </div>

      <Input
        label="4-Digit PIN"
        name="pin"
        type="text"
        value={form.pin}
        onChange={handleChange}
      />

      <div className="pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
