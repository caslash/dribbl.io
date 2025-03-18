'use client';
import Image from 'next/image';

export function CareerPath({ teams }: Readonly<{ teams?: string[] }>) {
  return (
    <div>
      <div className="flex flex-row">
        {teams &&
          teams.map((id: string) => (
            <Image
              key={id}
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
