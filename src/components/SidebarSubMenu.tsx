// 'use client';

// import { createContext, useContext, useState } from 'react';

// const SidebarContext = createContext({
//   collapsed: false,
//   toggleCollapse: () => {},
// });

// export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const toggleCollapse = () => setCollapsed((prev) => !prev);

//   return (
//     <SidebarContext.Provider value={{ collapsed, toggleCollapse }}>
//       {children}
//     </SidebarContext.Provider>
//   );
// };

// export const useSidebar = () => useContext(SidebarContext);

// components/sidebar/SidebarSubMenu.tsx
'use client';

import { useState } from 'react';
import SidebarItem from './SidebarItem';

interface SubItem {
  label: string;
  href: string;
}

interface SidebarSubMenuProps {
  label: string;
  subItems: SubItem[];
  collapsed: boolean;
}

export default function SidebarSubMenu({ label, subItems, collapsed }: SidebarSubMenuProps) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center px-4 py-2 w-full text-left text-sm text-gray-300 hover:bg-gray-800 rounded"
      >
        {!collapsed && label}
      </button>

      {!collapsed && open && (
        <div className="ml-4 mt-1 space-y-1">
          {subItems.map((item, i) => (
            <SidebarItem key={i} label={item.label} href={item.href} collapsed={false} />
          ))}
        </div>
      )}
    </div>
  );
}
