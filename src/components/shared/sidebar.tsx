'use client';
import DashboardNav from '@/components/shared/dashboard-nav';
import { navItems } from '@/constants/data';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';
import { ChevronsLeft } from 'lucide-react';
import { useState } from 'react';
import Logo from './logo';
import ThemeToggle from '@/components/shared/theme-toggle';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <nav
      className={cn(
        `relative z-10 hidden h-screen flex-none px-3 md:block`,
        status && 'duration-500',
        // !isMinimized ? 'w-72' : 'w-[80px]',
        !isMinimized ? 'w-72 px-3' : 'w-[80px] px-1',
        className
      )}
    >
      <div
        className={cn(
          // 'flex items-center px-0 py-5 md:px-2',
          'flex items-center px-0 py-5 md:px-2',
          isMinimized ? 'justify-center' : 'justify-between'
        )}
      >
        {!isMinimized && <Logo />}
        <ChevronsLeft
          className={cn(
            'size-8 cursor-pointer rounded-full border bg-background text-foreground',
            isMinimized && 'rotate-180'
          )}
          onClick={handleToggle}
        />
      </div>

      {/* Make this div fill available space */}
      <div className="flex h-[calc(100vh-200px)] flex-col justify-between">
        {/* <div className="flex flex-col justify-between h-full" > */}

        {/* Navigation */}
        <div className="space-y-4 overflow-y-auto">
          {/* <div className="space-y-4 py-4"> */}
          <div className="px-2 py-2">
            <div className="mt-3 space-y-1">
              <DashboardNav items={navItems} />
            </div>
          </div>
        </div>

        {/* Theme Toggle at Bottom */}
        <div className="flex justify-center py-4">
          <div>
            {!isMinimized && <p className="hidden md:block">Theme</p>}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
