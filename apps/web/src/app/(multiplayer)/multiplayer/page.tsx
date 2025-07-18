'use client';

import { CareerPath } from '@/components/careerpath/careerpathview';
import JoinHostModal from '@/components/config/multiplayer/joinhostmodal';
import PlayerSearchBar from '@/components/search/playersearchbar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDBUser } from '@/context/dbusercontext';
import useMultiplayerSocket from '@/hooks/useMultiplayerSocket';
import { UserGameInfo } from '@dribblio/types';
import { User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Game() {
  const {
    isConnected,
    roomId,
    roundActive,
    canStartGame,
    onStartGame,
    users,
    onHostRoom,
    onJoinRoom,
    teams,
    players,
    onGuess,
    timeLeft,
    validAnswers,
  } = useMultiplayerSocket();

  const { user, hasPermission } = useDBUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !hasPermission('play:multiplayer')) {
      router.push('/not-found');
    }
  }, [hasPermission, router, user]);

  if (user && !hasPermission('play:multiplayer')) {
    return null;
  }

  return (
    <div className="flex flex-col h-full space-y-8 pt-12">
      {!user ? (
        <>
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Multiplayer Unavailable</DialogTitle>
              </DialogHeader>
              <p>In order to play multiplayer, you must be logged in.</p>
              <Button asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          <JoinHostModal isOpen={!roomId} onJoinRoom={onJoinRoom} onHostRoom={onHostRoom} />
          <div className="justify-start">
            {process.env.NODE_ENV === 'development' && (
              <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
            )}
            {roomId && <p>{`Room Code: ${roomId}`}</p>}
            {users.some((user: UserGameInfo) => user) && (
              <div>
                <p>Users:</p>
                <ul>
                  {users.map((user: UserGameInfo) => (
                    <li key={user.info.id}>
                      <div className="flex flex-row space-x-2 items-center">
                        {user.info.profile_url ? (
                          <Avatar>
                            <AvatarImage
                              src={user.info.profile_url}
                              alt={user.info.name ?? ''}
                              width={24}
                              height={24}
                            />
                          </Avatar>
                        ) : (
                          <User />
                        )}
                        <p>{user.info.name}</p>
                        <p>{user.score}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {canStartGame && (
            <div>
              <Button onClick={onStartGame}>Start Game</Button>
            </div>
          )}

          {roundActive && (
            <div className="w-full flex flex-col items-center space-y-8">
              <p className="text-2xl font-bold">Time Left: {timeLeft}</p>
              <CareerPath teams={teams!} />
              <PlayerSearchBar playerList={players} onSelect={onGuess} />
            </div>
          )}

          {!roundActive && !canStartGame && (
            <div>
              <p>Correct Answers:</p>
              <ul>
                {validAnswers.map((answer) => (
                  <li key={answer.id}>{answer.display_first_last}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
