import { Link } from 'react-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

interface GameCard {
  title: string;
  description: string;
  href: string;
  cta: string;
}

const GAME_CARDS: GameCard[] = [
  {
    title: 'Career Path',
    description:
      'Guess the player from their career team history. Test your NBA knowledge round after round.',
    href: '/career',
    cta: 'Play Now',
  },
  {
    title: 'NBA Draft',
    description:
      'Build your all-time NBA dream team. Draft against friends in real time — pick wisely.',
    href: '/draft',
    cta: 'Play Now',
  },
];

/**
 * Home page with hero cards for each game mode.
 */
export function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-5xl font-bold tracking-tight text-navy-900 dark:text-cream-100 sm:text-6xl">
          dribbl.io
        </h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
          NBA knowledge games for the obsessed fan.
        </p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        {GAME_CARDS.map((card) => (
          <Card
            key={card.href}
            className="flex flex-col gap-4 transition-shadow hover:shadow-md"
          >
            <div className="flex-1">
              <h2 className="font-serif text-2xl font-bold text-navy-900 dark:text-cream-100">
                {card.title}
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                {card.description}
              </p>
            </div>
            <Link to={card.href}>
              <Button variant="primary" size="md" className="w-full">
                {card.cta}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
