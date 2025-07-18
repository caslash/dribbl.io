'use client';

import { useDBUser } from '@/context/dbusercontext';
import { BASE_WS_URL } from '@/lib/constants';
import { createContext, useContext, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

interface MultiplayerContextType {
  socket?: Socket;
}

const defaultMultiplayerContext: MultiplayerContextType = {
  socket: undefined,
};

const MultiplayerContext = createContext<MultiplayerContextType>(defaultMultiplayerContext);
export const useMultiplayer = () => useContext(MultiplayerContext) ?? defaultMultiplayerContext;

export function MultiplayerProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const { permissions } = useDBUser();

  const socket = useMemo(() => {
    return io(`${BASE_WS_URL}/multiplayer`, {
      autoConnect: false,
      auth: {
        permissions,
      },
    });
  }, [permissions]);

  return <MultiplayerContext.Provider value={{ socket }}>{children}</MultiplayerContext.Provider>;
}
