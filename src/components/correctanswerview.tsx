'use client';

import NextImage from 'next/image';
import { Image } from '@heroui/react';
import { Player } from '@prisma/client';

export default function CorrectAnswerView({
  isCorrect,
  correctPlayer,
}: Readonly<{ isCorrect: boolean; correctPlayer: Player }>) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="font-black">
        {isCorrect ? 'Correct! It was:' : 'Incorrect. The correct answer was:'}
      </h1>
      <p>{correctPlayer.display_first_last}</p>
      <Image
        alt={`player-image-${correctPlayer.id}`}
        as={NextImage}
        src={`https://cdn.nba.com/headshots/nba/latest/260x190/${correctPlayer.id}.png`}
        width={260}
        height={190}
      />
    </div>
  );
}
