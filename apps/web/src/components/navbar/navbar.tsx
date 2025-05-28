'use client';

import { Dock, DockIcon } from '@/components/magicui/dock';
import ThemeSwitcher from '@/components/navbar/themeswitcher';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import NextLink from 'next/link';

export default function NBANavbar({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={`${className}`}>
      <TooltipProvider>
        <Dock className="rounded-full" iconMagnification={60} iconDistance={25}>
          {siteConfig.navItems.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NextLink
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon', className: 'rounded-full' }),
                    )}
                  >
                    <item.icon />
                  </NextLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="h-full py-2" />
          <ThemeSwitcher />
        </Dock>
      </TooltipProvider>
    </div>
  );
}
