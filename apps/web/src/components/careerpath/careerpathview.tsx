'use client';
import Image from 'next/image';

export function CareerPath({ teams }: Readonly<{ teams?: string[] }>) {
  const containerKey = teams?.join('-') || 'empty';

  return (
    <div key={containerKey}>
      <div className="flex flex-row">
        {teams?.map((id: string, index: number) => (
          <Image
            key={`${id}-${index}`}
            alt={`logo-${id}`}
            src={`/logos/${id}.svg`}
            className={`${id === '1610612762' ? 'dark:invert' : ''}`}
            width={100}
            height={100}
          />
        ))}
      </div>
    </div>
  );
}
