  'use client';

  import { MoreVertical, ChevronLast, ChevronFirst } from 'lucide-react';
  import Link from 'next/link';
  import { useContext, createContext, useState, ReactNode } from 'react';
  // 1. Tipe & Context
  type SidebarContextType = {
    expanded: boolean;
  };

  const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

  // 2. Sidebar (wrapper utama)
  interface SidebarProps {
    children: ReactNode;
  }

  // Komponen utama wrapper sidebar
  export default function Sidebar({ children }: SidebarProps) {
    const [expanded, setExpanded] = useState(true);

    return (
      <aside className="h-screen">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          {/* Header: Logo + Toggle */}
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src="https://img.logoipsum.com/243.svg"
              className={`overflow-hidden transition-all ${expanded ? 'w-32' : 'w-0'}`}
              alt="Logo"
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          {/* Body: Item list */}
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          {/* Footer: User profile */}
          <div className="border-t flex p-3">
            <img
              src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
              alt="User Avatar"
              className="w-10 h-10 rounded-md"
            />
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${
                expanded ? 'w-52 ml-3' : 'w-0'
              }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">Julio</h4>
                <span className="text-xs text-gray-600">media.julio68@gmail.com</span>
              </div>
              <MoreVertical size={20} />
            </div>
          </div>
        </nav>
      </aside>
    );
  }

  // 3. SidebarItem
  interface SidebarItemProps {
    icon: ReactNode;
    text: string;
    href?: string;
    active?: boolean;
    alert?: boolean;
    children?: ReactNode;
  }
  export function SidebarItem({ icon, text, href, active = false, alert = false, children }: SidebarItemProps) {
    const context = useContext(SidebarContext);
    if (!context) {
      throw new Error('SidebarItem must be used within <Sidebar>.');
    }

    const { expanded } = context;

    const content = (
      <div className="flex items-center cursor-pointer">
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}>
          {text}
        </span>

        {alert && (
          <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? '' : 'top-2'}`} />
        )}
      </div>
    );

    return (
      <li
        className={`
          relative flex flex-col py-2 px-3 my-1
          font-medium rounded-md transition-colors group
          ${active
            ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
            : 'hover:bg-indigo-50 text-gray-600'}
        `}
      >
        {href ? (
          <Link href={href}>{content}</Link>
        ) : (
          content
        )}

        {/* Sub Items */}
        {children && (
          <ul className={`pl-8 mt-1 ${expanded ? '' : 'hidden'}`}>
            {children}
          </ul>
        )}
      </li>
    );
  }

  // 4. SidebarSubItem
  interface SidebarSubItemProps {
    text: string;
    href?: string;
    active?: boolean;
  }
  export function SidebarSubItem({ text, href, active = false }: SidebarSubItemProps) {
    const className = `
      block py-1 px-2 rounded-md text-sm transition-colors
      ${active ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100 text-gray-600'}
    `;

    return (
      <li>
        {href ? (
          <Link href={href} className={className}>
            {text}
          </Link>
        ) : (
          <span className={className}>{text}</span>
        )}
      </li>
    );
  }

