import { ElementType } from "react";

export interface SubItem {
  label: string;
  href: string;
}

export interface SidebarSubMenuProps {
  label: string;
  icon?: ElementType;
  subItems: SubItem[];
  collapsed: boolean;
}

export interface SidebarItemProps {
  label: string;
  href: string;
  icon?: ElementType;
  collapsed: boolean;
}

export interface PaginationProps {
  page: number
  pageSize: number
  total: number
  pageSizes: number[]
  onPaginate: (state: { page: number; pageSize: number }) => void
  siblingCount?: number
  boundaryCount?: number
  showFirstLast?: boolean
}