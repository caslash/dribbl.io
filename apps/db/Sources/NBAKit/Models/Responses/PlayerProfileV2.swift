import Foundation

public struct PlayerProfileV2: ResponseInitializable {
    let regularSeasonTotals: [SeasonTotalsRegularSeason]
    let careerRegularSeasonTotals: CareerTotalsRegularSeason?
    let postSeasonTotals: [SeasonTotalsPostSeason]
    let careerPostSeasonTotals: CareerTotalsPostSeason?
    let allStarSeasonTotals: [SeasonTotalsAllStarSeason]
    let careerAllStarTotals: CareerTotalsAllStarSeason?
    let collegeSeasonTotals: [SeasonTotalsCollegeSeason]
    let careerCollegeTotals: CareerTotalsCollegeSeason?
    let preseasonTotals: [SeasonTotalsPreseason]
    let careerPreseasonTotals: CareerTotalsPreseason?
    let regularSeasonRankings: [SeasonRankingsRegularSeason]
    let postSeasonRankings: [SeasonRankingsPostSeason]
    let seasonHighs: [SeasonHigh]
    let careerHighs: [CareerHigh]

    public init(from data: Data) throws {
        let decoder = JSONDecoder()
        let resp = try decoder.decode(NBAAPIResponse.self, from: data)

        self.regularSeasonTotals = try resp.resultSets.rows(
            of: SeasonTotalsRegularSeason.self, named: "SeasonTotalsRegularSeason")
        self.careerRegularSeasonTotals = try resp.resultSets.rows(
            of: CareerTotalsRegularSeason.self, named: "CareerTotalsRegularSeason"
        ).first
        self.postSeasonTotals = try resp.resultSets.rows(
            of: SeasonTotalsPostSeason.self, named: "SeasonTotalsPostSeason")
        self.careerPostSeasonTotals = try resp.resultSets.rows(
            of: CareerTotalsPostSeason.self, named: "CareerTotalsPostSeason"
        ).first
        self.allStarSeasonTotals = try resp.resultSets.rows(
            of: SeasonTotalsAllStarSeason.self, named: "SeasonTotalsAllStarSeason")
        self.careerAllStarTotals = try resp.resultSets.rows(
            of: CareerTotalsAllStarSeason.self, named: "CareerTotalsAllStarSeason"
        ).first
        self.collegeSeasonTotals = try resp.resultSets.rows(
            of: SeasonTotalsCollegeSeason.self, named: "SeasonTotalsCollegeSeason")
        self.careerCollegeTotals = try resp.resultSets.rows(
            of: CareerTotalsCollegeSeason.self, named: "CareerTotalsCollegeSeason"
        ).first
        self.preseasonTotals = try resp.resultSets.rows(
            of: SeasonTotalsPreseason.self, named: "SeasonTotalsPreseason")
        self.careerPreseasonTotals = try resp.resultSets.rows(
            of: CareerTotalsPreseason.self, named: "CareerTotalsPreseason"
        ).first
        self.regularSeasonRankings = try resp.resultSets.rows(
            of: SeasonRankingsRegularSeason.self, named: "SeasonRankingsRegularSeason")
        self.postSeasonRankings = try resp.resultSets.rows(
            of: SeasonRankingsPostSeason.self, named: "SeasonRankingsPostSeason")
        self.seasonHighs = try resp.resultSets.rows(of: SeasonHigh.self, named: "SeasonHigh")
        self.careerHighs = try resp.resultSets.rows(of: CareerHigh.self, named: "CareerHigh")
    }
}

struct SeasonTotalsRegularSeason: RowInitializable {
    let playerId: Int
    let seasonId: String
    let leagueId: String
    let teamId: Int
    let teamAbbreviation: String
    let playerAge: Double
    let gamesPlayed: Int
    let gamesStarted: Int
    let minutes: Double
    let fgm: Double
    let fga: Double
    let fgPct: Double
    let fg3m: Double
    let fg3a: Double
    let fg3Pct: Double
    let ftm: Double
    let fta: Double
    let ftPct: Double
    let oreb: Double
    let dreb: Double
    let rebounds: Double
    let assists: Double
    let steals: Double
    let blocks: Double
    let turnovers: Double
    let personalFouls: Double
    let points: Double

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.seasonId = v("SEASON_ID")?.stringValue ?? ""
        self.leagueId = v("LEAGUE_ID")?.stringValue ?? ""
        self.teamId = v("TEAM_ID")?.intValue ?? 0
        self.teamAbbreviation = v("TEAM_ABBREVIATION")?.stringValue ?? ""
        self.playerAge = v("PLAYER_AGE")?.doubleValue ?? 0
        self.gamesPlayed = v("GP")?.intValue ?? 0
        self.gamesStarted = v("GS")?.intValue ?? 0
        self.minutes = v("MIN")?.doubleValue ?? 0
        self.fgm = v("FGM")?.doubleValue ?? 0
        self.fga = v("FGA")?.doubleValue ?? 0
        self.fgPct = v("FG_PCT")?.doubleValue ?? 0
        self.fg3m = v("FG3M")?.doubleValue ?? 0
        self.fg3a = v("FG3A")?.doubleValue ?? 0
        self.fg3Pct = v("FG3_PCT")?.doubleValue ?? 0
        self.ftm = v("FTM")?.doubleValue ?? 0
        self.fta = v("FTA")?.doubleValue ?? 0
        self.ftPct = v("FT_PCT")?.doubleValue ?? 0
        self.oreb = v("OREB")?.doubleValue ?? 0
        self.dreb = v("DREB")?.doubleValue ?? 0
        self.rebounds = v("REB")?.doubleValue ?? 0
        self.assists = v("AST")?.doubleValue ?? 0
        self.steals = v("STL")?.doubleValue ?? 0
        self.blocks = v("BLK")?.doubleValue ?? 0
        self.turnovers = v("TOV")?.doubleValue ?? 0
        self.personalFouls = v("PF")?.doubleValue ?? 0
        self.points = v("PTS")?.doubleValue ?? 0
    }
}

struct CareerTotalsRegularSeason: RowInitializable {
    let playerId: Int
    let leagueId: String
    let teamId: Int
    let gamesPlayed: Int
    let gamesStarted: Int
    let minutes: Double
    let fgm: Double
    let fga: Double
    let fgPct: Double
    let fg3m: Double
    let fg3a: Double
    let fg3Pct: Double
    let ftm: Double
    let fta: Double
    let ftPct: Double
    let oreb: Double
    let dreb: Double
    let rebounds: Double
    let assists: Double
    let steals: Double
    let blocks: Double
    let turnovers: Double
    let personalFouls: Double
    let points: Double

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.leagueId = v("LEAGUE_ID")?.stringValue ?? ""
        self.teamId = v("TEAM_ID")?.intValue ?? 0
        self.gamesPlayed = v("GP")?.intValue ?? 0
        self.gamesStarted = v("GS")?.intValue ?? 0
        self.minutes = v("MIN")?.doubleValue ?? 0
        self.fgm = v("FGM")?.doubleValue ?? 0
        self.fga = v("FGA")?.doubleValue ?? 0
        self.fgPct = v("FG_PCT")?.doubleValue ?? 0
        self.fg3m = v("FG3M")?.doubleValue ?? 0
        self.fg3a = v("FG3A")?.doubleValue ?? 0
        self.fg3Pct = v("FG3_PCT")?.doubleValue ?? 0
        self.ftm = v("FTM")?.doubleValue ?? 0
        self.fta = v("FTA")?.doubleValue ?? 0
        self.ftPct = v("FT_PCT")?.doubleValue ?? 0
        self.oreb = v("OREB")?.doubleValue ?? 0
        self.dreb = v("DREB")?.doubleValue ?? 0
        self.rebounds = v("REB")?.doubleValue ?? 0
        self.assists = v("AST")?.doubleValue ?? 0
        self.steals = v("STL")?.doubleValue ?? 0
        self.blocks = v("BLK")?.doubleValue ?? 0
        self.turnovers = v("TOV")?.doubleValue ?? 0
        self.personalFouls = v("PF")?.doubleValue ?? 0
        self.points = v("PTS")?.doubleValue ?? 0
    }
}

struct SeasonTotalsPostSeason: RowInitializable {
    let playerId: Int
    let seasonId: String
    let leagueId: String
    let teamId: Int
    let teamAbbreviation: String
    let playerAge: Int
    let gamesPlayed: Int
    let gamesStarted: Int
    let minutes: Double
    let fgm: Double
    let fga: Double
    let fgPct: Double
    let fg3m: Double
    let fg3a: Double
    let fg3Pct: Double
    let ftm: Double
    let fta: Double
    let ftPct: Double
    let oreb: Double
    let dreb: Double
    let rebounds: Double
    let assists: Double
    let steals: Double
    let blocks: Double
    let turnovers: Double
    let personalFouls: Double
    let points: Double

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.seasonId = v("SEASON_ID")?.stringValue ?? ""
        self.leagueId = v("LEAGUE_ID")?.stringValue ?? ""
        self.teamId = v("TEAM_ID")?.intValue ?? 0
        self.teamAbbreviation = v("TEAM_ABBREVIATION")?.stringValue ?? ""
        self.playerAge = v("PLAYER_AGE")?.intValue ?? 0
        self.gamesPlayed = v("GP")?.intValue ?? 0
        self.gamesStarted = v("GS")?.intValue ?? 0
        self.minutes = v("MIN")?.doubleValue ?? 0
        self.fgm = v("FGM")?.doubleValue ?? 0
        self.fga = v("FGA")?.doubleValue ?? 0
        self.fgPct = v("FG_PCT")?.doubleValue ?? 0
        self.fg3m = v("FG3M")?.doubleValue ?? 0
        self.fg3a = v("FG3A")?.doubleValue ?? 0
        self.fg3Pct = v("FG3_PCT")?.doubleValue ?? 0
        self.ftm = v("FTM")?.doubleValue ?? 0
        self.fta = v("FTA")?.doubleValue ?? 0
        self.ftPct = v("FT_PCT")?.doubleValue ?? 0
        self.oreb = v("OREB")?.doubleValue ?? 0
        self.dreb = v("DREB")?.doubleValue ?? 0
        self.rebounds = v("REB")?.doubleValue ?? 0
        self.assists = v("AST")?.doubleValue ?? 0
        self.steals = v("STL")?.doubleValue ?? 0
        self.blocks = v("BLK")?.doubleValue ?? 0
        self.turnovers = v("TOV")?.doubleValue ?? 0
        self.personalFouls = v("PF")?.doubleValue ?? 0
        self.points = v("PTS")?.doubleValue ?? 0
    }
}

struct CareerTotalsPostSeason: RowInitializable {
    let playerId: Int
    let seasonId: String
    let leagueId: String
    let teamId: Int
    let teamAbbreviation: String
    let playerAge: Int
    let gamesPlayed: Int
    let gamesStarted: Int
    let minutes: Double
    let fgm: Double
    let fga: Double
    let fgPct: Double
    let fg3m: Double
    let fg3a: Double
    let fg3Pct: Double
    let ftm: Double
    let fta: Double
    let ftPct: Double
    let oreb: Double
    let dreb: Double
    let rebounds: Double
    let assists: Double
    let steals: Double
    let blocks: Double
    let turnovers: Double
    let personalFouls: Double
    let points: Double

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.seasonId = v("SEASON_ID")?.stringValue ?? ""
        self.leagueId = v("LEAGUE_ID")?.stringValue ?? ""
        self.teamId = v("TEAM_ID")?.intValue ?? 0
        self.teamAbbreviation = v("TEAM_ABBREVIATION")?.stringValue ?? ""
        self.playerAge = v("PLAYER_AGE")?.intValue ?? 0
        self.gamesPlayed = v("GP")?.intValue ?? 0
        self.gamesStarted = v("GS")?.intValue ?? 0
        self.minutes = v("MIN")?.doubleValue ?? 0
        self.fgm = v("FGM")?.doubleValue ?? 0
        self.fga = v("FGA")?.doubleValue ?? 0
        self.fgPct = v("FG_PCT")?.doubleValue ?? 0
        self.fg3m = v("FG3M")?.doubleValue ?? 0
        self.fg3a = v("FG3A")?.doubleValue ?? 0
        self.fg3Pct = v("FG3_PCT")?.doubleValue ?? 0
        self.ftm = v("FTM")?.doubleValue ?? 0
        self.fta = v("FTA")?.doubleValue ?? 0
        self.ftPct = v("FT_PCT")?.doubleValue ?? 0
        self.oreb = v("OREB")?.doubleValue ?? 0
        self.dreb = v("DREB")?.doubleValue ?? 0
        self.rebounds = v("REB")?.doubleValue ?? 0
        self.assists = v("AST")?.doubleValue ?? 0
        self.steals = v("STL")?.doubleValue ?? 0
        self.blocks = v("BLK")?.doubleValue ?? 0
        self.turnovers = v("TOV")?.doubleValue ?? 0
        self.personalFouls = v("PF")?.doubleValue ?? 0
        self.points = v("PTS")?.doubleValue ?? 0
    }
}

struct SeasonTotalsAllStarSeason: RowInitializable {
    let playerId: Int
    let seasonId: String
    let leagueId: String
    let teamId: Int
    let teamAbbreviation: String
    let playerAge: Double
    let gamesPlayed: Int
    let gamesStarted: Int
    let minutes: Double
    let fgm: Double
    let fga: Double
    let fgPct: Double
    let fg3m: Double
    let fg3a: Double
    let fg3Pct: Double
    let ftm: Double
    let fta: Double
    let ftPct: Double
    let oreb: Double
    let dreb: Double
    let rebounds: Double
    let assists: Double
    let steals: Double
    let blocks: Double
    let turnovers: Double
    let personalFouls: Double
    let points: Double

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.seasonId = v("SEASON_ID")?.stringValue ?? ""
        self.leagueId = v("LEAGUE_ID")?.stringValue ?? ""
        self.teamId = v("TEAM_ID")?.intValue ?? 0
        self.teamAbbreviation = v("TEAM_ABBREVIATION")?.stringValue ?? ""
        self.playerAge = v("PLAYER_AGE")?.doubleValue ?? 0
        self.gamesPlayed = v("GP")?.intValue ?? 0
        self.gamesStarted = v("GS")?.intValue ?? 0
        self.minutes = v("MIN")?.doubleValue ?? 0
        self.fgm = v("FGM")?.doubleValue ?? 0
        self.fga = v("FGA")?.doubleValue ?? 0
        self.fgPct = v("FG_PCT")?.doubleValue ?? 0
        self.fg3m = v("FG3M")?.doubleValue ?? 0
        self.fg3a = v("FG3A")?.doubleValue ?? 0
        self.fg3Pct = v("FG3_PCT")?.doubleValue ?? 0
        self.ftm = v("FTM")?.doubleValue ?? 0
        self.fta = v("FTA")?.doubleValue ?? 0
        self.ftPct = v("FT_PCT")?.doubleValue ?? 0
        self.oreb = v("OREB")?.doubleValue ?? 0
        self.dreb = v("DREB")?.doubleValue ?? 0
        self.rebounds = v("REB")?.doubleValue ?? 0
        self.assists = v("AST")?.doubleValue ?? 0
        self.steals = v("STL")?.doubleValue ?? 0
        self.blocks = v("BLK")?.doubleValue ?? 0
        self.turnovers = v("TOV")?.doubleValue ?? 0
        self.personalFouls = v("PF")?.doubleValue ?? 0
        self.points = v("PTS")?.doubleValue ?? 0
    }
}

struct CareerTotalsAllStarSeason: RowInitializable {
    let playerId: Int
    let leagueId: String
    let teamId: Int
    let gamesPlayed: Int
    let gamesStarted: Int
    let minutes: Double
    let fgm: Double
    let fga: Double
    let fgPct: Double
    let fg3m: Double
    let fg3a: Double
    let fg3Pct: Double
    let ftm: Double
    let fta: Double
    let ftPct: Double
    let oreb: Double
    let dreb: Double
    let rebounds: Double
    let assists: Double
    let steals: Double
    let blocks: Double
    let turnovers: Double
    let personalFouls: Double
    let points: Double

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.leagueId = v("LEAGUE_ID")?.stringValue ?? ""
        self.teamId = v("TEAM_ID")?.intValue ?? 0
        self.gamesPlayed = v("GP")?.intValue ?? 0
        self.gamesStarted = v("GS")?.intValue ?? 0
        self.minutes = v("MIN")?.doubleValue ?? 0
        self.fgm = v("FGM")?.doubleValue ?? 0
        self.fga = v("FGA")?.doubleValue ?? 0
        self.fgPct = v("FG_PCT")?.doubleValue ?? 0
        self.fg3m = v("FG3M")?.doubleValue ?? 0
        self.fg3a = v("FG3A")?.doubleValue ?? 0
        self.fg3Pct = v("FG3_PCT")?.doubleValue ?? 0
        self.ftm = v("FTM")?.doubleValue ?? 0
        self.fta = v("FTA")?.doubleValue ?? 0
        self.ftPct = v("FT_PCT")?.doubleValue ?? 0
        self.oreb = v("OREB")?.doubleValue ?? 0
        self.dreb = v("DREB")?.doubleValue ?? 0
        self.rebounds = v("REB")?.doubleValue ?? 0
        self.assists = v("AST")?.doubleValue ?? 0
        self.steals = v("STL")?.doubleValue ?? 0
        self.blocks = v("BLK")?.doubleValue ?? 0
        self.turnovers = v("TOV")?.doubleValue ?? 0
        self.personalFouls = v("PF")?.doubleValue ?? 0
        self.points = v("PTS")?.doubleValue ?? 0
    }
}

struct SeasonTotalsCollegeSeason: RowInitializable {
    let playerId: Int
    let seasonId: String
    let leagueId: String
    let organizationId: Int
    let schoolName: String
    let playerAge: Double
    let gamesPlayed: Int
    let gamesStarted: Int
    let minutes: Double
    let fgm: Double
    let fga: Double
    let fgPct: Double
    let fg3m: Double
    let fg3a: Double
    let fg3Pct: Double
    let ftm: Double
    let fta: Double
    let ftPct: Double
    let oreb: Double
    let dreb: Double
    let rebounds: Double
    let assists: Double
    let steals: Double
    let blocks: Double
    let turnovers: Double
    let personalFouls: Double
    let points: Double

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.seasonId = v("SEASON_ID")?.stringValue ?? ""
        self.leagueId = v("LEAGUE_ID")?.stringValue ?? ""
        self.organizationId = v("ORGANIZATION_ID")?.intValue ?? 0
        self.schoolName = v("SCHOOL_NAME")?.stringValue ?? ""
        self.playerAge = v("PLAYER_AGE")?.doubleValue ?? 0
        self.gamesPlayed = v("GP")?.intValue ?? 0
        self.gamesStarted = v("GS")?.intValue ?? 0
        self.minutes = v("MIN")?.doubleValue ?? 0
        self.fgm = v("FGM")?.doubleValue ?? 0
        self.fga = v("FGA")?.doubleValue ?? 0
        self.fgPct = v("FG_PCT")?.doubleValue ?? 0
        self.fg3m = v("FG3M")?.doubleValue ?? 0
        self.fg3a = v("FG3A")?.doubleValue ?? 0
        self.fg3Pct = v("FG3_PCT")?.doubleValue ?? 0
        self.ftm = v("FTM")?.doubleValue ?? 0
        self.fta = v("FTA")?.doubleValue ?? 0
        self.ftPct = v("FT_PCT")?.doubleValue ?? 0
        self.oreb = v("OREB")?.doubleValue ?? 0
        self.dreb = v("DREB")?.doubleValue ?? 0
        self.rebounds = v("REB")?.doubleValue ?? 0
        self.assists = v("AST")?.doubleValue ?? 0
        self.steals = v("STL")?.doubleValue ?? 0
        self.blocks = v("BLK")?.doubleValue ?? 0
        self.turnovers = v("TOV")?.doubleValue ?? 0
        self.personalFouls = v("PF")?.doubleValue ?? 0
        self.points = v("PTS")?.doubleValue ?? 0
    }
}

struct CareerTotalsCollegeSeason: RowInitializable {
    let playerId: Int
    let leagueId: String
    let organizationId: Int
    let gamesPlayed: Int
    let gamesStarted: Int
    let minutes: Double
    let fgm: Double
    let fga: Double
    let fgPct: Double
    let fg3m: Double
    let fg3a: Double
    let fg3Pct: Double
    let ftm: Double
    let fta: Double
    let ftPct: Double
    let oreb: Double
    let dreb: Double
    let rebounds: Double
    let assists: Double
    let steals: Double
    let blocks: Double
    let turnovers: Double
    let personalFouls: Double
    let points: Double

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.leagueId = v("LEAGUE_ID")?.stringValue ?? ""
        self.organizationId = v("ORGANIZATION_ID")?.intValue ?? 0
        self.gamesPlayed = v("GP")?.intValue ?? 0
        self.gamesStarted = v("GS")?.intValue ?? 0
        self.minutes = v("MIN")?.doubleValue ?? 0
        self.fgm = v("FGM")?.doubleValue ?? 0
        self.fga = v("FGA")?.doubleValue ?? 0
        self.fgPct = v("FG_PCT")?.doubleValue ?? 0
        self.fg3m = v("FG3M")?.doubleValue ?? 0
        self.fg3a = v("FG3A")?.doubleValue ?? 0
        self.fg3Pct = v("FG3_PCT")?.doubleValue ?? 0
        self.ftm = v("FTM")?.doubleValue ?? 0
        self.fta = v("FTA")?.doubleValue ?? 0
        self.ftPct = v("FT_PCT")?.doubleValue ?? 0
        self.oreb = v("OREB")?.doubleValue ?? 0
        self.dreb = v("DREB")?.doubleValue ?? 0
        self.rebounds = v("REB")?.doubleValue ?? 0
        self.assists = v("AST")?.doubleValue ?? 0
        self.steals = v("STL")?.doubleValue ?? 0
        self.blocks = v("BLK")?.doubleValue ?? 0
        self.turnovers = v("TOV")?.doubleValue ?? 0
        self.personalFouls = v("PF")?.doubleValue ?? 0
        self.points = v("PTS")?.doubleValue ?? 0
    }
}

struct SeasonTotalsPreseason: RowInitializable {
    let playerId: Int
    let seasonId: String
    let leagueId: String
    let teamId: Int
    let teamAbbreviation: String
    let playerAge: Double
    let gamesPlayed: Int
    let gamesStarted: Int
    let minutes: Double
    let fgm: Double
    let fga: Double
    let fgPct: Double
    let fg3m: Double
    let fg3a: Double
    let fg3Pct: Double
    let ftm: Double
    let fta: Double
    let ftPct: Double
    let oreb: Double
    let dreb: Double
    let rebounds: Double
    let assists: Double
    let steals: Double
    let blocks: Double
    let turnovers: Double
    let personalFouls: Double
    let points: Double

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.seasonId = v("SEASON_ID")?.stringValue ?? ""
        self.leagueId = v("LEAGUE_ID")?.stringValue ?? ""
        self.teamId = v("TEAM_ID")?.intValue ?? 0
        self.teamAbbreviation = v("TEAM_ABBREVIATION")?.stringValue ?? ""
        self.playerAge = v("PLAYER_AGE")?.doubleValue ?? 0
        self.gamesPlayed = v("GP")?.intValue ?? 0
        self.gamesStarted = v("GS")?.intValue ?? 0
        self.minutes = v("MIN")?.doubleValue ?? 0
        self.fgm = v("FGM")?.doubleValue ?? 0
        self.fga = v("FGA")?.doubleValue ?? 0
        self.fgPct = v("FG_PCT")?.doubleValue ?? 0
        self.fg3m = v("FG3M")?.doubleValue ?? 0
        self.fg3a = v("FG3A")?.doubleValue ?? 0
        self.fg3Pct = v("FG3_PCT")?.doubleValue ?? 0
        self.ftm = v("FTM")?.doubleValue ?? 0
        self.fta = v("FTA")?.doubleValue ?? 0
        self.ftPct = v("FT_PCT")?.doubleValue ?? 0
        self.oreb = v("OREB")?.doubleValue ?? 0
        self.dreb = v("DREB")?.doubleValue ?? 0
        self.rebounds = v("REB")?.doubleValue ?? 0
        self.assists = v("AST")?.doubleValue ?? 0
        self.steals = v("STL")?.doubleValue ?? 0
        self.blocks = v("BLK")?.doubleValue ?? 0
        self.turnovers = v("TOV")?.doubleValue ?? 0
        self.personalFouls = v("PF")?.doubleValue ?? 0
        self.points = v("PTS")?.doubleValue ?? 0
    }
}

struct CareerTotalsPreseason: RowInitializable {
    let playerId: Int
    let leagueId: String
    let teamId: Int
    let gamesPlayed: Int
    let gamesStarted: Int
    let minutes: Double
    let fgm: Double
    let fga: Double
    let fgPct: Double
    let fg3m: Double
    let fg3a: Double
    let fg3Pct: Double
    let ftm: Double
    let fta: Double
    let ftPct: Double
    let oreb: Double
    let dreb: Double
    let rebounds: Double
    let assists: Double
    let steals: Double
    let blocks: Double
    let turnovers: Double
    let personalFouls: Double
    let points: Double

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.leagueId = v("LEAGUE_ID")?.stringValue ?? ""
        self.teamId = v("TEAM_ID")?.intValue ?? 0
        self.gamesPlayed = v("GP")?.intValue ?? 0
        self.gamesStarted = v("GS")?.intValue ?? 0
        self.minutes = v("MIN")?.doubleValue ?? 0
        self.fgm = v("FGM")?.doubleValue ?? 0
        self.fga = v("FGA")?.doubleValue ?? 0
        self.fgPct = v("FG_PCT")?.doubleValue ?? 0
        self.fg3m = v("FG3M")?.doubleValue ?? 0
        self.fg3a = v("FG3A")?.doubleValue ?? 0
        self.fg3Pct = v("FG3_PCT")?.doubleValue ?? 0
        self.ftm = v("FTM")?.doubleValue ?? 0
        self.fta = v("FTA")?.doubleValue ?? 0
        self.ftPct = v("FT_PCT")?.doubleValue ?? 0
        self.oreb = v("OREB")?.doubleValue ?? 0
        self.dreb = v("DREB")?.doubleValue ?? 0
        self.rebounds = v("REB")?.doubleValue ?? 0
        self.assists = v("AST")?.doubleValue ?? 0
        self.steals = v("STL")?.doubleValue ?? 0
        self.blocks = v("BLK")?.doubleValue ?? 0
        self.turnovers = v("TOV")?.doubleValue ?? 0
        self.personalFouls = v("PF")?.doubleValue ?? 0
        self.points = v("PTS")?.doubleValue ?? 0
    }
}

struct SeasonRankingsRegularSeason: RowInitializable {
    let playerId: Int
    let seasonId: String
    let leagueId: String
    let teamId: Int
    let teamAbbreviation: String
    let playerAge: String
    let gamesPlayed: String
    let gamesStarted: String
    let rankPgMin: Int
    let rankPgFgm: Int
    let rankPgFga: Int
    let rankFgPct: Int
    let rankPgFg3m: Int
    let rankPgFg3a: Int
    let rankFg3Pct: Int
    let rankPgFtm: Int
    let rankPgFta: Int
    let rankFtPct: Int
    let rankPgOreb: Int
    let rankPgDreb: Int
    let rankPgReb: Int
    let rankPgAst: Int
    let rankPgStl: Int
    let rankPgBlk: Int
    let rankPgTov: Int
    let rankPgPts: Int
    let rankPgEff: Int

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.seasonId = v("SEASON_ID")?.stringValue ?? ""
        self.leagueId = v("LEAGUE_ID")?.stringValue ?? ""
        self.teamId = v("TEAM_ID")?.intValue ?? 0
        self.teamAbbreviation = v("TEAM_ABBREVIATION")?.stringValue ?? ""
        self.playerAge = v("PLAYER_AGE")?.stringValue ?? ""
        self.gamesPlayed = v("GP")?.stringValue ?? ""
        self.gamesStarted = v("GS")?.stringValue ?? ""
        self.rankPgMin = v("RANK_PG_MIN")?.intValue ?? 0
        self.rankPgFgm = v("RANK_PG_FGM")?.intValue ?? 0
        self.rankPgFga = v("RANK_PG_FGA")?.intValue ?? 0
        self.rankFgPct = v("RANK_FG_PCT")?.intValue ?? 0
        self.rankPgFg3m = v("RANK_PG_FG3M")?.intValue ?? 0
        self.rankPgFg3a = v("RANK_PG_FG3A")?.intValue ?? 0
        self.rankFg3Pct = v("RANK_FG3_PCT")?.intValue ?? 0
        self.rankPgFtm = v("RANK_PG_FTM")?.intValue ?? 0
        self.rankPgFta = v("RANK_PG_FTA")?.intValue ?? 0
        self.rankFtPct = v("RANK_FT_PCT")?.intValue ?? 0
        self.rankPgOreb = v("RANK_PG_OREB")?.intValue ?? 0
        self.rankPgDreb = v("RANK_PG_DREB")?.intValue ?? 0
        self.rankPgReb = v("RANK_PG_REB")?.intValue ?? 0
        self.rankPgAst = v("RANK_PG_AST")?.intValue ?? 0
        self.rankPgStl = v("RANK_PG_STL")?.intValue ?? 0
        self.rankPgBlk = v("RANK_PG_BLK")?.intValue ?? 0
        self.rankPgTov = v("RANK_PG_TOV")?.intValue ?? 0
        self.rankPgPts = v("RANK_PG_PTS")?.intValue ?? 0
        self.rankPgEff = v("RANK_PG_EFF")?.intValue ?? 0
    }
}

struct SeasonRankingsPostSeason: RowInitializable {
    let playerId: Int
    let seasonId: String
    let leagueId: String
    let teamId: Int
    let teamAbbreviation: String
    let playerAge: String
    let gamesPlayed: String
    let gamesStarted: String
    let rankPgMin: Int
    let rankPgFgm: Int
    let rankPgFga: Int
    let rankFgPct: Int
    let rankPgFg3m: Int
    let rankPgFg3a: Int
    let rankFg3Pct: Int
    let rankPgFtm: Int
    let rankPgFta: Int
    let rankFtPct: Int
    let rankPgOreb: Int
    let rankPgDreb: Int
    let rankPgReb: Int
    let rankPgAst: Int
    let rankPgStl: Int
    let rankPgBlk: Int
    let rankPgTov: Int
    let rankPgPts: Int
    let rankPgEff: Int

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.seasonId = v("SEASON_ID")?.stringValue ?? ""
        self.leagueId = v("LEAGUE_ID")?.stringValue ?? ""
        self.teamId = v("TEAM_ID")?.intValue ?? 0
        self.teamAbbreviation = v("TEAM_ABBREVIATION")?.stringValue ?? ""
        self.playerAge = v("PLAYER_AGE")?.stringValue ?? ""
        self.gamesPlayed = v("GP")?.stringValue ?? ""
        self.gamesStarted = v("GS")?.stringValue ?? ""
        self.rankPgMin = v("RANK_PG_MIN")?.intValue ?? 0
        self.rankPgFgm = v("RANK_PG_FGM")?.intValue ?? 0
        self.rankPgFga = v("RANK_PG_FGA")?.intValue ?? 0
        self.rankFgPct = v("RANK_FG_PCT")?.intValue ?? 0
        self.rankPgFg3m = v("RANK_PG_FG3M")?.intValue ?? 0
        self.rankPgFg3a = v("RANK_PG_FG3A")?.intValue ?? 0
        self.rankFg3Pct = v("RANK_FG3_PCT")?.intValue ?? 0
        self.rankPgFtm = v("RANK_PG_FTM")?.intValue ?? 0
        self.rankPgFta = v("RANK_PG_FTA")?.intValue ?? 0
        self.rankFtPct = v("RANK_FT_PCT")?.intValue ?? 0
        self.rankPgOreb = v("RANK_PG_OREB")?.intValue ?? 0
        self.rankPgDreb = v("RANK_PG_DREB")?.intValue ?? 0
        self.rankPgReb = v("RANK_PG_REB")?.intValue ?? 0
        self.rankPgAst = v("RANK_PG_AST")?.intValue ?? 0
        self.rankPgStl = v("RANK_PG_STL")?.intValue ?? 0
        self.rankPgBlk = v("RANK_PG_BLK")?.intValue ?? 0
        self.rankPgTov = v("RANK_PG_TOV")?.intValue ?? 0
        self.rankPgPts = v("RANK_PG_PTS")?.intValue ?? 0
        self.rankPgEff = v("RANK_PG_EFF")?.intValue ?? 0
    }
}

struct SeasonHigh: RowInitializable {
    let playerId: Int
    let gameId: String
    let gameDate: String
    let vsTeamId: Int
    let vsTeamCity: String
    let vsTeamName: String
    let vsTeamAbbreviation: String
    let stat: String
    let statValue: Int
    let statOrder: Int
    let dateEst: String

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.gameId = v("GAME_ID")?.stringValue ?? ""
        self.gameDate = v("GAME_DATE")?.stringValue ?? ""
        self.vsTeamId = v("VS_TEAM_ID")?.intValue ?? 0
        self.vsTeamCity = v("VS_TEAM_CITY")?.stringValue ?? ""
        self.vsTeamName = v("VS_TEAM_NAME")?.stringValue ?? ""
        self.vsTeamAbbreviation = v("VS_TEAM_ABBREVIATION")?.stringValue ?? ""
        self.stat = v("STAT")?.stringValue ?? ""
        self.statValue = v("STAT_VALUE")?.intValue ?? 0
        self.statOrder = v("STAT_ORDER")?.intValue ?? 0
        self.dateEst = v("DATE_EST")?.stringValue ?? ""
    }
}

struct CareerHigh: RowInitializable {
    let playerId: Int
    let gameId: String
    let gameDate: String
    let vsTeamId: Int
    let vsTeamCity: String
    let vsTeamName: String
    let vsTeamAbbreviation: String
    let stat: String
    let statValue: Int
    let statOrder: Int
    let dateEst: String

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndexCaseInsensitive(of: key) else { return nil }
            return row[i]
        }

        self.playerId = v("PLAYER_ID")?.intValue ?? 0
        self.gameId = v("GAME_ID")?.stringValue ?? ""
        self.gameDate = v("GAME_DATE")?.stringValue ?? ""
        self.vsTeamId = v("VS_TEAM_ID")?.intValue ?? 0
        self.vsTeamCity = v("VS_TEAM_CITY")?.stringValue ?? ""
        self.vsTeamName = v("VS_TEAM_NAME")?.stringValue ?? ""
        self.vsTeamAbbreviation = v("VS_TEAM_ABBREVIATION")?.stringValue ?? ""
        self.stat = v("STAT")?.stringValue ?? ""
        self.statValue = v("STAT_VALUE")?.intValue ?? 0
        self.statOrder = v("STAT_ORDER")?.intValue ?? 0
        self.dateEst = v("DATE_EST")?.stringValue ?? ""
    }
}
