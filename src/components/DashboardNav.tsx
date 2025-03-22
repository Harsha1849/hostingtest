'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, BuildingOfficeIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const links = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: HomeIcon,
  },
  {
    href: '/dashboard/properties',
    label: 'Properties',
    icon: BuildingOfficeIcon,
  },
  {
    href: '/dashboard/contact-requests',
    label: 'Contact Requests',
    icon: EnvelopeIcon,
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition',
            pathname === href
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
          )}
        >
          <Icon className="w-5 h-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
