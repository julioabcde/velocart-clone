// export { default as Sidebar } from './Sidebar';
// export { SidebarProvider } from './SidebarContext';

// components/sidebar/SidebarItem.tsx
'use client';

import { ElementType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface SidebarItemProps {
  label: string;
  href: string;
  icon?: ElementType;
  collapsed: boolean;
}

export default function SidebarItem({ label, href, icon: Icon, collapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 text-sm',
        isActive ? 'bg-gray-800 font-semibold text-white' : 'text-gray-300',
        collapsed && 'justify-center'
      )}
    >
      {Icon && <Icon size={18} />}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
