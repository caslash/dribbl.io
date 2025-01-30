'use client';

import { Image } from '@heroui/react';
import NextImage from 'next/image';

export default function TeamLogo({
  teamId,
  theme,
}: Readonly<{ teamId: string; theme: string | undefined }>) {
  return (
    <Image
      alt={`logo-${teamId}`}
      as={NextImage}
      src={`/logos/${teamId}.svg`}
      className={`${teamId === '1610612762' ? (theme === 'dark' ? 'invert' : '') : ''}`}
      width={100}
      height={100}
    />
  );
}
