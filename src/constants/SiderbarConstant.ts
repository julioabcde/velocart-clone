import { Database, Computer, ChartLine } from 'lucide-react';

export const SIDEBAR_CONSTANT = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: ChartLine,
  },
  {
    label: 'Master',
    icon: Database,
    subItem: [
      {
        label: 'Category',
        href: '/master/category',
      },
      {
        label: 'Daily Capital',
        href: '/manage-daily-capital',
      },
      {
        label: 'Product',
        href: '/master/product',
      },
      {
        label: 'Staff',
        href: '/master/staff',
      },
      {
        label: 'Supplier',
        href: '/master/supplier',
      },
    ],
  },
  {
    label: 'Salesforce',
    href: '/point-of-sales',
    icon: Computer,
    subItem: [
      {
        label: 'Point of Sales',
        href: '/manage-cashier',
      },
    ],
  },
];
