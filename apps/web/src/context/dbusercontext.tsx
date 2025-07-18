'use client';

import { getAccessToken } from '@auth0/nextjs-auth0';
import { User } from '@dribblio/database/generated/prisma-users/client';
import { isEmpty } from 'lodash';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface DBUserContextType {
  user: User | undefined;
  permissions: string[];

  /**
   * Check if the user has a specific permission.
   * @param permission - The permission to check for.
   * @returns True if the user has the permission, false otherwise.
   */
  hasPermission: (permission: string) => boolean;

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

const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) throw new Error('Invalid token');

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const defaultUserContext: DBUserContextType = {
  user: undefined,
  permissions: [],
  hasPermission: () => false,
  updateUser: () => {},
  uploadAvatar: () => {},
};

const DBUserContext = createContext<DBUserContextType | undefined>(undefined);
export const useDBUser = () => useContext(DBUserContext) ?? defaultUserContext;

export function DBUserProvider({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    getAccessToken()
      .then((accessToken) => {
        if (!accessToken) return;

        const decodedToken = decodeJWT(accessToken);
        if (decodedToken?.permissions) {
          setPermissions(decodedToken.permissions);
        }
        return accessToken;
      })
      .then((accessToken) => {
        if (!accessToken) return;

        fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((res) => res.json())
          .then(setUser);
      })
      .catch(() => {});
  }, []);

  const hasPermission = useCallback(
    (permission: string) => {
      if (isEmpty(permissions)) return false;

      return permissions.includes(permission);
    },
    [permissions],
  );

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
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then(setUser);
    });
  }, []);

  return (
    <DBUserContext.Provider value={{ user, permissions, hasPermission, updateUser, uploadAvatar }}>
      {children}
    </DBUserContext.Provider>
  );
}
