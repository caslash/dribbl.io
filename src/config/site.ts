export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'NBA Career Game',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Multiplayer',
      href: '/game',
    },
    {
      label: 'Single Player',
      href: '/singleplayer',
    },
  ],
};
