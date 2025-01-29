# NBA Career Path Game

This is a Next.js web app game to measure your NBA history knowledge. The entire app is written in Typescript using SQLite and [Prisma.io ORM](https://www.prisma.io) for the database containing every NBA player to ever play a single game, and [HeroUI](https://www.heroui.com) for UI components.

## Getting Started

### Database

This project uses a modified version of the NBA database found on [Kaggle](https://www.kaggle.com/datasets/wyattowalsh/basketball). The modifications include:

- Added primary key to the players table
- Added players' team history
- Added players' career games played
- Added players' accolades (Coming Soon!)

To generate Prisma types from the database:

1. Initialize the Prisma CLI:

```bash
npx prisma init --datasource-provider sqlite
```

2. Move the SQLite database file into the `/prisma` folder and set the `DATABASE_URL` environment variable in the generated `.env`

3. Pull the database schema into Prisma:

```bash
npx prisma db pull
```

4. Generate the Prisma Client types:

```bash
npx prisma generate
```

### Building and Running

To install libraries:

```bash
npm i
```

To run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
