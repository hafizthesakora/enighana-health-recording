'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/layout/Header';
import Sidebar from '../../../components/layout/Sidebar';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function AddEmployeePage() {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    department: '',
    typology: '', // ← new
    pin: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.employeeId) errs.employeeId = 'Employee ID is required';
    if (!formData.name) errs.name = 'Name is required';
    if (!formData.email) errs.email = 'Email is required';
    if (!formData.department) errs.department = 'Department is required';
    if (!formData.typology) errs.typology = 'Typology is required'; // ← validation
    if (!/^\d{4}$/.test(formData.pin)) errs.pin = '4-digit PIN required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    const payload = {
      employeeId: formData.employeeId,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      typology: formData.typology, // ← include typology here
      pin: formData.pin,
    };
    console.log(payload);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      router.push('/employees');
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600" />
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
            <h1 className="text-xl font-bold mb-4">Add New Employee</h1>
            {errors.form && <p className="text-red-600 mb-4">{errors.form}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                error={errors.employeeId}
              />
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
              />

              {/* typology dropdown */}
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
                  value={formData.typology}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.typology ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                >
                  <option value="">Select typology</option>
                  <option value="PERMANENT">Permanent Staff</option>
                  <option value="CONTRACT">Contract Staff</option>
                  <option value="INTERN">Intern</option>
                  <option value="NATIONAL_SERVICE">
                    National Service Personnel
                  </option>
                </select>
                {errors.typology && (
                  <p className="mt-1 text-sm text-red-600">{errors.typology}</p>
                )}
              </div>

              <Input
                label="4-Digit PIN"
                name="pin"
                type="password"
                value={formData.pin}
                onChange={handleChange}
                error={errors.pin}
                maxLength={4}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Adding…' : 'Add Employee'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
