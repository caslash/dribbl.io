'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@auth0/nextjs-auth0';
import NextLink from 'next/link';

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="flex flex-col h-full space-y-8">
      {user && (
        <div>
          <p>Hello {user.given_name}!</p>
        </div>
      )}
      <div>
        <Button asChild>
          <NextLink href="/auth/logout">Logout</NextLink>
        </Button>
      </div>
    </div>
  );
}
