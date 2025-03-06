'use client';

import TeamLogo from '@/components/teamlogo';
import useUnveilLogos from '@/hooks/useUnveilLogos';
import { useEffect } from 'react';

export function UnveilingCareerPath({
  teamHistory,
}: Readonly<{
  teamHistory: string[];
}>) {
  const { visibleIndexes, unveilRandomLogoIndex } = useUnveilLogos(teamHistory);

  useEffect(() => {
    const unveilInterval = setInterval(() => {
      unveilRandomLogoIndex(unveilInterval);
    }, 2000);

    return () => {
      clearInterval(unveilInterval);
    };
  }, [unveilRandomLogoIndex]);

  return (
    <div>
      <div className="flex flex-row">
        {teamHistory.map((id: string, index: number) => (
          <TeamLogo
            key={id}
            className="max-h-[100] p-1 mx-2 rounded-xl shadow-xl bg-neutral-200 dark:bg-neutral-800"
            isHidden={!visibleIndexes.includes(index)}
            teamId={id}
          />
        ))}
      </div>
    </div>
  );
}
