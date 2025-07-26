import { LayoutDashboard, Database, FlaskConical } from 'lucide-react';

export const SIDEBAR_CONSTANT = [
  {
    label: 'Login',
    href: '/login',
    icon: LayoutDashboard,
  },
  {
    label: 'Master',
    icon: Database,
    subItem: [
      { label: 'Manage Cashier', href: '/manage-cashier' },
      { label: 'Manage Daily Capital', href: '/manage-daily-capital' },
    ],
  },
  {
    label: 'Test',
    href: '/test',
    icon: FlaskConical,
  },
];
