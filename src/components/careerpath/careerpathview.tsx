'use client';

import TeamLogo from '@/components/teamlogo';

export function CareerPath({ teams }: Readonly<{ teams?: string[] }>) {
  return (
    <div>
      <div className="flex flex-row">
        {teams && teams.map((id: string) => <TeamLogo isHidden={false} key={id} teamId={id} />)}
      </div>
    </div>
  );
}
