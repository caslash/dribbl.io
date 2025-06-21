'use client';

import { Button } from '@/components/ui/button';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { User } from '@dribblio/database/generated/prisma-users';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    getAccessToken().then((token) => {
      console.log(token);
      fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then(setUser);
    });
  }, []);

  return (
    <div className="flex flex-col h-full space-y-8">
      {user && (
        <div>
          <p>Hello {user.name}!</p>
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
