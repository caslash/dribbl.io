'use client';

import { Dock, DockIcon } from '@/components/magicui/dock';
import ThemeSwitcher from '@/components/navbar/themeswitcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { siteConfig } from '@/config/site';
import { useDBUser } from '@/context/dbusercontext';
import { cn } from '@/lib/utils';
import { LogIn, User as UserIcon } from 'lucide-react';
import NextLink from 'next/link';

export default function NBANavbar({ className }: Readonly<{ className?: string }>) {
  const { user } = useDBUser();

  return (
    <div className={`${className}`}>
      <TooltipProvider>
        <Dock className="rounded-full" iconMagnification={60} iconDistance={25}>
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                {user ? (
                  <NextLink href="/profile">
                    {user.profile_url ? (
                      <Avatar>
                        <AvatarImage
                          src={user.profile_url}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <UserIcon />
                    )}
                  </NextLink>
                ) : (
                  <a
                    href="/auth/login"
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon', className: 'rounded-full' }),
                    )}
                  >
                    <LogIn />
                  </a>
                )}
              </TooltipTrigger>
              <TooltipContent>{user ? <p>Profile</p> : <p>Login</p>}</TooltipContent>
            </Tooltip>
          </DockIcon>
          <Separator orientation="vertical" className="h-full py-2" />
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
