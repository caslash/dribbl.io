import { nba } from '@dribblio/database';

export default function PlayerSearchResult({ player }: Readonly<{ player: nba.Player }>) {
  return (
    <div className="flex flex-col justify-start gap-1 py-2">
      <p className="text-base">{player.display_first_last}</p>
      <p className="text-xs">{`${player.from_year}-${player.to_year}`}</p>
    </div>
  );
}
