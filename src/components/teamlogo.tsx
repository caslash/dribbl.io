'use client';

import { Image } from '@heroui/react';
import NextImage from 'next/image';

export default function TeamLogo({
  className,
  isHidden,
  teamId,
  theme,
}: Readonly<{ className?: string; isHidden: boolean; teamId: string; theme: string | undefined }>) {
  return (
    <Image
      hidden={isHidden}
      alt={`logo-${teamId}`}
      as={NextImage}
      src={`/logos/${teamId}.svg`}
      className={`${className} ${teamId === '1610612762' ? 'dark:invert' : ''}`}
      width={100}
      height={100}
    />
  );
}
