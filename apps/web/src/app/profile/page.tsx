'use client';

import { useUser } from '@auth0/nextjs-auth0';

export default function ProfilePage() {
  const { user, error, isLoading } = useUser();

  return (
    <div>
      {!user ? (
        <div>
          <p>Not Logged In</p>
        </div>
      ) : (
        <div>
          <p>Hello {user.name}</p>
        </div>
      )}
    </div>
  );
}
