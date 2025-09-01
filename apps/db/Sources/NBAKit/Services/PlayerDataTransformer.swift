import Foundation

public final class PlayerDataTransformer {
    public static func fillOutPlayer(
        _ player: inout Player, cpi: CommonPlayerInfo, profile: PlayerProfileV2
    ) {
        player.birthdate = cpi.birthdate
        player.school = cpi.school
        player.country = cpi.country
        player.height = cpi.height
        player.weight = cpi.weight
        player.season_exp = cpi.seasonExp
        player.jersey = Int(from: cpi.jersey) ?? nil
        player.position = cpi.position
        player.team_history = getPlayerTeamHistory(regularSeasonTotals: profile.regularSeasonTotals)
        player.is_active = cpi.rosterStatus == "Active"
        player.from_year = cpi.fromYear
        player.to_year = cpi.toYear
        player.total_games_played = getPlayerGamesPlayed(
            regularSeasonTotals: profile.regularSeasonTotals)
        player.draft_year = cpi.draftYear
        player.draft_round = cpi.draftRound
        player.draft_number = cpi.draftNumber

        let averages: (ppg: Double, rpg: Double, apg: Double) = getPlayerCareerAverages(
            careerRegularSeasonTotals: profile.careerRegularSeasonTotals)

        player.career_ppg = averages.ppg
        player.career_rpg = averages.rpg
        player.career_apg = averages.apg
    }

    private static func getPlayerTeamHistory(regularSeasonTotals: [SeasonTotalsRegularSeason])
        -> String
    {
        let filteredSeasons = regularSeasonTotals.filter { $0.teamId != 0 }
        let onlyNBASeasons = filteredSeasons.filter { $0.leagueId == "00" }
        let uniqueTeamIds = onlyNBASeasons.map { $0.teamId }.unique().map { String($0) }
        return uniqueTeamIds.joined(separator: ",")
    }

    private static func getPlayerGamesPlayed(regularSeasonTotals: [SeasonTotalsRegularSeason])
        -> Int
    {
        let filteredSeasons = regularSeasonTotals.filter { $0.teamId != 0 }
        let onlyNBASeasons = filteredSeasons.filter { $0.leagueId == "00" }
        return onlyNBASeasons.map { $0.gamesPlayed }.reduce(0) { (runningTotal, next) in
            runningTotal + next
        }
    }

    private static func getPlayerCareerAverages(
        careerRegularSeasonTotals: CareerTotalsRegularSeason?
    ) -> (ppg: Double, rpg: Double, apg: Double) {
        guard let careerRegularSeasonTotals else {
            return (0.0, 0.0, 0.0)
        }

        return (
            careerRegularSeasonTotals.points,
            careerRegularSeasonTotals.rebounds,
            careerRegularSeasonTotals.assists
        )
    }
}
