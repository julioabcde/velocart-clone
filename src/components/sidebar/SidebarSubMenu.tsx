'use client';

import { SidebarSubMenuProps } from '@/models/UIModels';
import SidebarItem from './SidebarItem';
import { useState } from 'react';

export default function SidebarSubMenu({ label, icon: Icon, subItems, collapsed }: SidebarSubMenuProps) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center px-4 py-2 w-full text-left text-sm text-gray-300 hover:bg-gray-800 rounded gap-3"
      >
        {Icon && <Icon size={18} />}
        {!collapsed && <span>{label}</span>}
      </button>

      {!collapsed && open && (
        <div className="ml-8 mt-1 space-y-1">
          {subItems.map((item, i) => (
            <SidebarItem key={i} label={item.label} href={item.href} collapsed={false} />
          ))}
        </div>
      )}
    </div>
  );
}