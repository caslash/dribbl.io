import { getPlayer } from '@/server/actions';

export default async function PlayerPage({
  params,
}: Readonly<{ params: Promise<{ id: number }> }>) {
  const id = Number((await params).id);
  const player = await getPlayer({
    include: {
      player_accolades: {
        select: {
          accolades: true,
        },
      },
    },
    where: { id: { equals: id } },
  });
  return (
    <div>
      {player && (
        <div>
          <h1>{player.display_first_last}</h1>
          {player.player_accolades?.accolades && (
            <ul>
              {player.player_accolades.accolades.PlayerAwards.map((award) => (
                <li
                  key={`${award.PERSON_ID}${award.SUBTYPE2 ? award.SUBTYPE2 : award.SUBTYPE1}${award.SEASON}${award.MONTH}${award.WEEK}`}
                >
                  {award.DESCRIPTION}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
