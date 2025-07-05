'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaInfoCircle, FaEnvelope } from 'react-icons/fa';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: 'Home', href: '/', icon: <FaHome /> },
    { label: 'Login', href: '/login', icon: <FaInfoCircle /> },
  ];

  return (
    <aside
      style={{
        width: collapsed ? '60px' : '200px',
        background: '#f0f0f0',
        padding: '1rem 0.5rem',
        transition: 'width 0.3s',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          marginBottom: '1rem',
          width: '100%',
          padding: '1rem 0.5rem',
          cursor: 'pointer',
        }}
      >
        {collapsed ? '→' : '←'}
      </button>

      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.href} style={{ marginBottom: '1rem' }}>
              <Link
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  color: '#333',
                  padding: '0.5rem',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
