import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: 'dashboard', // must match a valid icon in your system
    label: 'Home'
  },
  {
    title: 'Suppliers',
    href: '/suppliers',
    icon: 'suppliers',
    label: 'Suppliers'
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: 'clients',
    label: 'Clients'
  },
  {
    title: 'Network',
    href: '/network',
    icon: 'network',
    label: 'Network'
  },
  {
    title: 'About',
    href: '/about',
    icon: 'about',
    label: 'About'
  }
];

export const users = [
  {
    id: 1,
    name: 'Idrissa Elie',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Aganze Christian',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  }
];

export const dashboardCard = [
  {
    date: 'Today',
    total: 2000,
    role: 'Students',
    color: 'bg-[#EC4D61] bg-opacity-40'
  },
  {
    date: 'Today',
    total: 2000,
    role: 'Teachers',
    color: 'bg-[#FFEB95] bg-opacity-100'
  },
  {
    date: 'Today',
    total: 2000,
    role: 'Parents',
    color: 'bg-[#84BD47] bg-opacity-30'
  },
  {
    date: 'Today',
    total: 2000,
    role: 'Schools',
    color: 'bg-[#D289FF] bg-opacity-30'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};
