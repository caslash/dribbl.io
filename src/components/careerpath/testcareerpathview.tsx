'use client';

import { Player } from '@prisma/client';
import { v4 } from 'uuid';
import TeamLogo from '../teamlogo';

export function TestCareerPathView({
  player,
  theme,
}: Readonly<{ player: Player; theme: string | undefined }>) {
  return (
    <div>
      {player.team_history && (
        <div className="flex flex-row">
          {player.team_history.split(',').map((id: string, index: number) => (
            <div
              key={v4()}
              className="grid grid-rows-1 aspect-square shadow-lg p-4  mx-4 rounded-xl bg-neutral-200 dark:bg-neutral-800"
            >
              <svg height={100} width={100} xmlns="http://www.w3.org/2000/svg">
                <rect height={100} width={100} fillOpacity={0} />
              </svg>
              <TeamLogo isHidden={false} teamId={id} theme={theme} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
