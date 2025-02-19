'use client';

import { CareerPath } from '@/components/careerpath/careerpathview';
import PlayerSearchBar from '@/components/search/playersearchbar';
import useClientSocket from '@/hooks/useClientSocket';
import usePlayerSearch from '@/hooks/usePlayerSearch';
import { Button } from '@heroui/react';

export default function Game() {
  const { isConnected, canStartGame, onStartGame, machineState, round, score, teams, onGuess } =
    useClientSocket();
  const { playerCount, list } = usePlayerSearch();

  return (
    <div className="flex flex-col h-full m-16 space-y-8">
      <div className="justify-start">
        <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
        <p>State: {machineState}</p>
        {isConnected && (
          <div>{canStartGame && <Button onPress={onStartGame}>Start Game</Button>}</div>
        )}
      </div>

      {teams && (
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-col items-center">
            <p className="font-extrabold text-xl">Round: {round}</p>
            <p className="font-black text-2xl">Score: {score}</p>
          </div>
          <CareerPath teams={teams} />
          <PlayerSearchBar
            className="w-1/2"
            playerCount={playerCount}
            list={list}
            onSelect={onGuess}
          />
        </div>
      )}
    </div>
  );
}
