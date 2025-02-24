import { Button } from '@/components/ui/button';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Url } from 'next/dist/shared/lib/router/router';
import Image from 'next/image';
import Link from 'next/link';

export default function GameModeCard({
  className,
  title,
  description,
  href,
  imageHref,
}: Readonly<{
  className?: string;
  title: string;
  description: string;
  href: Url;
  imageHref: string | StaticImport;
}>) {
  return (
    <div
      className={`${className} flex rounded-lg border filter grayscale hover:grayscale-0 transition-all duration-300 relative`}
    >
      <div className="-z-100 h-full w-full">
        <Image src={imageHref} alt={`${title}-image`} fill className="object-cover rounded-lg" />
      </div>

      <div className="self-end w-full flex justify-between items-end p-8 absolute rounded-b-lg bg-gradient-to-t from-black to-transparent backdrop-blur-md">
        <div>
          <p className="text-white font-black text-xl">{title}</p>
          <p className="text-white text-sm">{description}</p>
        </div>

        <Button variant="ghost" className="align-center rounded-full text-white" asChild>
          <Link href={href}>Play</Link>
        </Button>
      </div>
    </div>
  );
}
