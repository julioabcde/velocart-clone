import { LayoutDashboard, Database, FlaskConical } from "lucide-react";

export const SIDEBAR_CONSTANT = [
  {
    label: "Login",
    href: "/login",
    icon: LayoutDashboard,
  },
  {
    label: "Master",
    icon: Database,
    subItem: [
      {
        label: "Category",
        href: "/master/category",
      },
      {
        label: "Daily Capital",
        href: "/manage-daily-capital",
      },
      {
        label: "Product",
        href: "/manage-product",
      },
      {
        label: "Staff",
        href: "/master/staff",
      },
    ],
  },
  {
    label: "Point of Sales",
    href: "/point-of-sales",
    icon: Database,
    subItem: [
      {
        label: "Manage Cashier",
        href: "/manage-cashier",
      },
    ],
  }
];
