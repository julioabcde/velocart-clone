import { Database, Computer, ChartLine } from "lucide-react";

export const SIDEBAR_CONSTANT = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: ChartLine,
  },
  {
    label: "Master",
    icon: Database,
    subItem: [
      {
        label: "Manage Cashier",
        href: "/manage-cashier",
      },
      {
        label: "Manage Daily Capital",
        href: "/manage-daily-capital",
      },
      {
        label: "Product",
        href: "/master/product",
      },
    ],
  },
  {
    label: "Point of Sales",
    href: "/point-of-sales",
    icon: Computer,
    subItem: [
      {
        label: "Manage Cashier",
        href: "/manage-cashier",
      },
    ],
  }
];
