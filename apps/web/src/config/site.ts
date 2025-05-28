import { Gamepad2, House, LucideProps, Swords, User } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type SiteConfig = typeof siteConfig;

type NavItem = {
  label: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  href: string;
};

export const siteConfig: { name: string; navItems: NavItem[] } = {
  name: 'NBA Career Game',
  navItems: [
    {
      label: 'Home',
      icon: House,
      href: '/',
    },
    {
      label: 'Profile',
      icon: User,
      href: '/profile',
    },
    {
      label: 'Single Player',
      icon: Gamepad2,
      href: '/singleplayer',
    },
    {
      label: 'Multiplayer',
      icon: Swords,
      href: '/multiplayer',
    },
  ],
};
