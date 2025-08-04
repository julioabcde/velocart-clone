'use client';

import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import SidebarItem from './SidebarItem';
import { SIDEBAR_CONSTANT } from '@/constants/SiderbarConstant'; 
import SidebarSubMenu from './SidebarSubMenu';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen sticky top-0">
      <aside className={`bg-gray-900 text-white p-2 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex justify-between items-center p-4">
          {!collapsed && <h1 className="text-lg font-bold">MyApp</h1>}
          <button onClick={() => setCollapsed(!collapsed)}>
            <FaBars />
          </button>
        </div>

        <nav className="space-y-2">
          {SIDEBAR_CONSTANT.map((item, i) =>
            item.subItem ? (
              <SidebarSubMenu
                key={i}
                label={item.label}
                icon={item.icon}
                subItems={item.subItem}
                collapsed={collapsed}
              />
            ) : (
              <SidebarItem
                key={i}
                label={item.label}
                href={item.href}
                icon={item.icon}
                collapsed={collapsed}
              />
            )
          )}
        </nav>
      </aside>
    </div>
  );
}