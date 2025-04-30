// File: app/page.js
import Link from 'next/link';

export const metadata = {
  title: 'ENI Ghana Health System',
  description: 'Securely manage employee fitness and medical records.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow bg-green-50 flex items-center">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-green-800 mb-4">
            Welcome to ENI Ghana Health System
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            A secure, QR-enabled platform for managing employee fitness-to-work
            certificates and confidential medical records.
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg shadow"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-block bg-transparent border-2 border-green-600 hover:bg-green-100 text-green-600 font-medium px-6 py-3 rounded-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Upload & Manage
            </h2>
            <p className="text-gray-600">
              Easily upload fitness certificates and medical records via a
              secure, role-based dashboard.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">QR-Code Access</h2>
            <p className="text-gray-600">
              Generate per-employee QR codes so health teams can instantly
              retrieve documents—PIN-protected for privacy.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Secure & Compliant
            </h2>
            <p className="text-gray-600">
              Built on JWT authentication with encrypted PINs and audit-ready
              records in MongoDB.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Real-Time Reporting
            </h2>
            <p className="text-gray-600">
              Track document expirations, health-statistics, and generate custom
              reports with ease.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-green-200 py-6">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ENI Ghana. All rights reserved.
          </p>
          <nav className="space-x-4 mt-4 md:mt-0">
            <Link href="/login" className="hover:underline">
              Sign In
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
