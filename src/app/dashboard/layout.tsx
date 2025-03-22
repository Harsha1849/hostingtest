'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome,
  FaPlus,
  FaList,
  FaHeart,
  FaUser,
  FaCog,
} from 'react-icons/fa';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: FaHome },
  { name: 'My Properties', href: '/dashboard/properties', icon: FaList },
  { name: 'Add Property', href: '/dashboard/properties/new', icon: FaPlus },
  { name: 'Favorites', href: '/dashboard/favorites', icon: FaHeart },
  { name: 'Profile', href: '/dashboard/profile', icon: FaUser },
  { name: 'Settings', href: '/dashboard/settings', icon: FaCog },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            Please sign in to access the dashboard.
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-600">EstatePro</h2>
            <p className="text-sm text-gray-600 mt-1">Dashboard</p>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 