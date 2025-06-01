'use client';

import { CareerPath } from '@/components/careerpath/careerpathview';
import JoinHostModal from '@/components/config/multiplayer/joinhostmodal';
import PlayerSearchBar from '@/components/search/playersearchbar';
import { Button } from '@/components/ui/button';
import useMultiplayerSocket from '@/hooks/useMultiplayerSocket';
import { UserGameInfo } from '@dribblio/types';

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

  return (
    <div className="flex flex-col h-full m-16 space-y-8">
      <JoinHostModal isOpen={!roomId} onJoinRoom={onJoinRoom} onHostRoom={onHostRoom} />
      <div className="justify-start">
        <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
        {roomId && <p>{`Room Code: ${roomId}`}</p>}
        {users.some((user: UserGameInfo) => user) && (
          <div>
            <p>Users:</p>
            <ul>
              {users.map((user: UserGameInfo) => (
                <li key={user.info.id}>
                  <div className="flex flex-row space-x-2">
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
    </div>
  );
}
