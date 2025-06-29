'use client';

import { getAccessToken } from '@auth0/nextjs-auth0';
import { User } from '@dribblio/database/generated/prisma-users/client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface DBUserContextType {
  user: User | undefined;

  /**
   * Update user fields in the database and sync local state.
   * @param user - Partial user object with fields to update.
   */
  updateUser: (user: Partial<User>) => void;

  /**
   * Upload a new avatar image to the database and sync local state.
   * @param avatar - The avatar image file to upload.
   */
  uploadAvatar: (avatar: File) => void;
}

const defaultUserContext: DBUserContextType = {
  user: undefined,
  updateUser: () => {},
  uploadAvatar: () => {},
};

const DBUserContext = createContext<DBUserContextType | undefined>(undefined);
export const useDBUser = () => useContext(DBUserContext) ?? defaultUserContext;

export function DBUserProvider({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    getAccessToken().then((accessToken) => {
      if (!accessToken) return;

      fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then(setUser);
    });
  }, []);

  const updateUser = useCallback((user: Partial<User>) => {
    getAccessToken().then((accessToken) => {
      if (!accessToken) return;

      fetch('/api/me', {
        method: 'PATCH',
        body: JSON.stringify(user),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(setUser);
    });
  }, []);

  const uploadAvatar = useCallback((avatar: File) => {
    getAccessToken().then((accessToken) => {
      if (!accessToken) return;

      const formData = new FormData();
      formData.append('avatar', avatar);

      fetch('/api/me/avatar', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then(setUser);
    });
  }, []);

  return (
    <DBUserContext.Provider value={{ user, updateUser, uploadAvatar }}>
      {children}
    </DBUserContext.Provider>
  );
}
