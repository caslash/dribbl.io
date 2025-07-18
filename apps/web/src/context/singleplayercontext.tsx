'use client';

import { BASE_WS_URL } from '@/lib/constants';
import { createContext, useContext, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

interface SinglePlayerContextType {
  socket?: Socket;
}

const defaultSinglePlayerContext: SinglePlayerContextType = {
  socket: undefined,
};

const SinglePlayerContext = createContext<SinglePlayerContextType>(defaultSinglePlayerContext);
export const useSinglePlayer = () => useContext(SinglePlayerContext) ?? defaultSinglePlayerContext;

export function SinglePlayerProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const socket = useMemo(() => {
    return io(`${BASE_WS_URL}/singleplayer`, {
      autoConnect: false,
    });
  }, []);

  return <SinglePlayerContext.Provider value={{ socket }}>{children}</SinglePlayerContext.Provider>;
}
