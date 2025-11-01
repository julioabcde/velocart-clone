'use client';

import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import SidebarItem from './SidebarItem';
import { SIDEBAR_CONSTANT } from '@/constants/SiderbarConstant';
import SidebarSubMenu from './SidebarSubMenu';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-gray-900 text-white shadow-lg"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-gray-900 text-white transition-all duration-300 z-40
          ${collapsed ? 'w-16' : 'w-64'}
          
          /* Mobile styles */
          fixed lg:sticky top-0 h-screen
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          {!collapsed && <h1 className="text-lg font-bold">Velocart</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-2 hover:bg-gray-800 rounded"
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
        </div>

        <nav className="space-y-2 p-2 overflow-y-auto h-[calc(100vh-73px)]">
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
    </>
  );
}