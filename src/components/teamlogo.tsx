'use client';

import { Image } from '@heroui/react';
import { useTheme } from 'next-themes';
import NextImage from 'next/image';

export default function TeamLogo({ teamId }: Readonly<{ teamId: string }>) {
  const { theme } = useTheme();
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
