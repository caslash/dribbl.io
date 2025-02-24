'use client';

import NextImage from 'next/image';

export default function TeamLogo({
  className,
  isHidden,
  teamId,
}: Readonly<{ className?: string; isHidden: boolean; teamId: string }>) {
  return (
    <div className={`relative ${className}`}>
      <NextImage
        hidden={isHidden}
        alt={`logo-${teamId}`}
        src={`/logos/${teamId}.svg`}
        className={`absolute inset-0 ${teamId === '1610612762' ? 'dark:invert' : ''}`}
        width={100}
        height={100}
      />
      <svg className="" height={100} width={100} xmlns="http://www.w3.org/2000/svg">
        <rect height="100%" width="100%" fillOpacity={0} />
      </svg>
    </div>
  );
}
