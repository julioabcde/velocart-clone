import { Database, Computer, ChartLine, Warehouse, ClipboardPlus } from 'lucide-react';

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
    label: 'Inventory Management',
    icon: Warehouse,
    subItem: [
      {
        label: 'Product',
        href: '/inventory/product'
      },
      {
        label: 'Stock',
        href: '/inventory/stock'
      }
    ]
  },
  {
    label: 'Salesforce',
    icon: Computer,
    subItem: [
      {
        label: 'Point of Sales',
        href: '/manage-cashier',
      },
    ],
  },
  {
    label: 'Report',
    icon: ClipboardPlus,
    subItem: [
      {
        label: 'Stock',
        href: '/inventory/stock',
      },
    ],
  },
];
