export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'NBA Career Game',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Play',
      href: '/game',
    },
    {
      label: 'Players',
      href: '/players',
    },
  ],
};
