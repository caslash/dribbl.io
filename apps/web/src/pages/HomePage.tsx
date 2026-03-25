import { Link } from 'react-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageMeta } from '@/components/PageMeta';
import { Helmet } from 'react-helmet-async';

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
  {
    title: 'Daily Roster',
    description:
      'Name every player from a mystery NBA roster. One challenge per day — 3 lives, no second chances.',
    href: '/daily',
    cta: 'Play Today',
  },
];

const JSON_LD_SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'dribbl.io',
    url: 'https://dribbl.io',
    description: 'NBA knowledge games for the obsessed fan.',
    applicationCategory: 'Game',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'dribbl.io',
    url: 'https://dribbl.io',
  },
];

function HomePageJsonLd() {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(JSON_LD_SCHEMA)}</script>
    </Helmet>
  );
}

/**
 * Home page with hero cards for each game mode.
 */
export function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <PageMeta
        title="dribbl.io — NBA Knowledge Games"
        description="NBA knowledge games for the obsessed fan. Play Career Path, Daily Roster, and the NBA All-Time Draft."
        canonicalPath="/"
      />
      <HomePageJsonLd />
      <div className="mb-12 text-center">
        <h1 className="font-serif text-5xl font-bold tracking-tight text-primary-text sm:text-6xl">
          dribbl.io
        </h1>
        <p className="mt-4 text-lg text-text-muted">
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
              <h2 className="font-serif text-2xl font-bold text-primary-text">
                {card.title}
              </h2>
              <p className="mt-2 text-text-muted">
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
