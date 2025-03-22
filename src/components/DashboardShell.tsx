'use client';

import DashboardNav from './DashboardNav';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <DashboardNav />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
} 