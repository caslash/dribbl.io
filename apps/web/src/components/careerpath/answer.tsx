'use client';

import { nba } from '@dribblio/database';
import { Player } from '@dribblio/database/generated/prisma-nba/client';
import NextImage from 'next/image';

function sortByGamesPlayed(a: Player, b: Player): number {
  return (b.total_games_played ?? 0) - (a.total_games_played ?? 0);
}

const CorrectAnswer = ({
  correctPlayer,
  validAnswers,
}: Readonly<{ correctPlayer?: nba.Player; validAnswers?: nba.Player[] }>) => {
  return (
    <div className="flex flex-col items-center">
      {correctPlayer && (
        <div>
          <p className="text-center">
            Correct! <span className="font-black">{correctPlayer.display_first_last}</span> was a
            correct answer.
          </p>
          <NextImage
            alt={`player-image-${correctPlayer.id}`}
            src={`https://cdn.nba.com/headshots/nba/latest/260x190/${correctPlayer.id}.png`}
            width={260}
            height={190}
          />
        </div>
      )}
      {validAnswers && (
        <div>
          <p className="text-center">Correct! Possible answers include:</p>

          <div className="flex flex-col items-center">
            {validAnswers
              .sort(sortByGamesPlayed)
              .slice(0, 3)
              .map((player) => (
                <div className="flex flex-row items-center" key={player.id}>
                  <NextImage
                    alt={`player-image-${player.id}`}
                    src={`https://cdn.nba.com/headshots/nba/latest/260x190/${player.id}.png`}
                    width={65}
                    height={47.5}
                  />
                  <p>{player.display_first_last}</p>
                </div>
              ))}
            {validAnswers.length > 3 && <p>and {validAnswers.length - 3} more!</p>}
          </div>
        </div>
      )}
    </div>
  );
};

const IncorrectAnswer = ({ possibleAnswers }: Readonly<{ possibleAnswers: nba.Player[] }>) => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-center">Incorrect, the possible answers were:</p>
      <div className="flex flex-col items-center">
        {possibleAnswers.map((player) => (
          <div className="flex flex-row items-center" key={player.id}>
            <NextImage
              alt={`player-image-${player.id}`}
              src={`https://cdn.nba.com/headshots/nba/latest/260x190/${player.id}.png`}
              width={65}
              height={47.5}
            />
            <p>{player.display_first_last}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { CorrectAnswer, IncorrectAnswer };
