'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const router = useRouter();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' },
    { name: 'Employees', href: '/employees', icon: 'UsersIcon' },
    { name: 'Documents', href: '/documents', icon: 'DocumentIcon' },
    { name: 'Reports', href: '/reports', icon: 'ChartBarIcon' },
    { name: 'Settings', href: '/settings', icon: 'CogIcon' },
  ];

  return (
    <div className="h-screen w-64 bg-green-800 text-white flex flex-col">
      <div className="p-4">
        {/* <img src="/logo.svg" alt="ENI Ghana Logo" className="h-20 w-30" /> */}
        <h1 className="text-2xl font-bold text-center mt-4">
          Eni Ghana Health System
        </h1>
      </div>

      <nav className="mt-8 flex-1">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = router.pathname === item.href;

            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <span
                    className={`flex items-center px-4 py-2 rounded-md ${
                      isActive
                        ? 'bg-green-900 text-white'
                        : 'text-green-100 hover:bg-green-700'
                    }`}
                  >
                    <span className="mr-3">{/* We can add icon here */}</span>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-green-700">
        <p className="text-sm text-green-200">Version Amanoah</p>
      </div>
    </div>
  );
}
