'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard">
            <span className="flex items-center">
              <img
                src="/logo.png"
                alt="ENI Ghana Logo"
                className="h-10 w-auto mr-2"
              />
              <span className="text-xl font-bold text-green-700">
                Health Recording System
              </span>
            </span>
          </Link>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
