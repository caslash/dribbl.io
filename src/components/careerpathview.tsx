'use client';

import { Player } from '@prisma/client';
import { v4 } from 'uuid';
import TeamLogo from './teamlogo';

export function CareerPathView({
  player,
  theme,
}: Readonly<{ player?: Player | null; theme: string | undefined }>) {
  return (
    <div>
      {player?.team_history && (
        <div className="flex flex-row">
          {player.team_history.split(',').map((id: string) => (
            <TeamLogo key={v4()} teamId={id} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}
