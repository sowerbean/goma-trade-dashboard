import { Icons } from '@/components/ui/icons';

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}
//
export type Order = {
  client_id: string;
  ready_to_load: string;
  loading_date: string;
  container_number: string;
  invoice_number: string;
  date_in: string;
  origin_warehouse: string;
  sales_person?: string;
  LCL_FCL: string;
  marks: string;
  client_name: string;
  client_phone_number: string;
  tin_number: string;
  destination: string;
  goods_type: string;
  packages: string;
  CBM: string;
  weight: string;
  supplier_name: string;
  supplier_phone_number: string;
  brand: string;
  off_loading_fee?: string;
  mark?: string;
};

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
