'use client';

import TeamLogo from '@/components/teamlogo';
import { v4 } from 'uuid';

export function CareerPath({ teams }: Readonly<{ teams?: string[] }>) {
  return (
    <div>
      <div className="flex flex-row">
        {teams && teams.map((id: string) => <TeamLogo isHidden={false} key={v4()} teamId={id} />)}
      </div>
    </div>
  );
}
