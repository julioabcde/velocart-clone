// 'use client';

// import { SIDEBAR_CONFIG } from '@/constants/sidebar.config';
// import { useSidebar } from './SidebarContext';
// import Link from 'next/link';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// export default function Sidebar() {
//   const { collapsed, toggleCollapse } = useSidebar();

//   return (
//     <aside
//       className={`h-screen bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-18' : 'w-64'
//         }`}
//     >
//       <div className="flex items-center justify-center p-4">
//         {!collapsed ? (
//           <>
//             <h1 className="text-lg font-bold flex-1">MyApp</h1>
//             <button onClick={toggleCollapse}>
//               <ChevronLeft />
//             </button>
//           </>
//         ) : (
//           <button onClick={toggleCollapse}>
//             <ChevronRight />
//           </button>
//         )}
//       </div>


//       <nav className="mt-4 space-y-2">
//         {SIDEBAR_CONFIG.map((item, i) => {
//           const Icon = item.icon;
//           return (
//             <div key={i} className="px-4">
//               <Link
//                 href={item.href || '#'}
//                 className="flex items-center gap-4 py-2 hover:bg-gray-800 rounded-md px-2"
//               >
//                 {Icon && <Icon size={20} />}
//                 {!collapsed && <span>{item.label}</span>}
//               </Link>

//               {!collapsed &&
//                 item.subItem?.map((sub, j) => (
//                   <Link
//                     key={j}
//                     href={sub.href}
//                     className="ml-8 text-sm block py-1 hover:text-gray-300"
//                   >
//                     {sub.label}
//                   </Link>
//                 ))}
//             </div>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }

// components/sidebar/Sidebar.tsx
// Sidebar.tsx
'use client';

import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import SidebarItem from './SidebarItem';
import SidebarSubMenu from './SidebarSubMenu';
import { SIDEBAR_CONSTANT } from '@/constants/sidebar.config'; 

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


