import Foundation

// MARK: - Phase & State Enums

/// High-level phase of the Daily Roster game screen.
enum DailyPhase {
    case loading, playing, complete
}

/// Error states surfaced to the Daily Roster UI.
enum DailyError {
    case noChallenge, networkError
}

/// The outcome of a single guess submission in the Daily Roster game.
enum GuessOutcome {
    case correct, wrong, duplicate
}

// MARK: - API Response Types

/// The challenge metadata returned by `GET /api/daily/roster/:date`.
struct DailyChallengeDTO: Codable {
    let challengeDate: String
    let teamId: Int
    let teamFullName: String
    let teamAbbreviation: String
    let seasonId: String
    let rosterSize: Int
}

/// Player details included in a correct guess response from the daily roster endpoint.
struct RosterGuessPlayerDTO: Codable {
    let playerId: Int
    let fullName: String
    let position: String?
    let jerseyNumber: String?
    let ptsPg: Double?
    let astPg: Double?
    let rebPg: Double?
}

/// Discriminated union returned by `POST /api/daily/roster/:date/guess`.
///
/// The response JSON does not carry an explicit type tag — the cases are distinguished
/// by inspecting the combination of `correct`, `duplicate`, and `error` fields:
/// - `error == "NO_CHALLENGE"` → `.noChallenge`
/// - `correct == true && duplicate == true` → `.duplicate`
/// - `correct == true` → `.correct`
/// - `correct == false` → `.wrong`
enum RosterGuessResponse: Decodable {
    case correct(player: RosterGuessPlayerDTO, index: Int, namedIds: [Int], rosterSize: Int)
    case duplicate(player: RosterGuessPlayerDTO)
    case wrong(rosterSize: Int)
    case noChallenge

    private enum CodingKeys: String, CodingKey {
        case correct, duplicate, player, index, namedIds, rosterSize, error
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)

        if let error = try? c.decode(String.self, forKey: .error), error == "NO_CHALLENGE" {
            self = .noChallenge
            return
        }

        let isCorrect = (try? c.decode(Bool.self, forKey: .correct)) ?? false
        if isCorrect {
            let isDuplicate = (try? c.decode(Bool.self, forKey: .duplicate)) ?? false
            let player = try c.decode(RosterGuessPlayerDTO.self, forKey: .player)
            if isDuplicate {
                self = .duplicate(player: player)
            } else {
                let index = try c.decode(Int.self, forKey: .index)
                let namedIds = try c.decode([Int].self, forKey: .namedIds)
                let rosterSize = try c.decode(Int.self, forKey: .rosterSize)
                self = .correct(player: player, index: index, namedIds: namedIds, rosterSize: rosterSize)
            }
        } else {
            let rosterSize = (try? c.decode(Int.self, forKey: .rosterSize)) ?? 0
            self = .wrong(rosterSize: rosterSize)
        }
    }
}

// MARK: - Session Persistence

/// Persisted state for a daily session, keyed by date in `UserDefaults`.
/// Allows the app to restore an in-progress or completed session across launches.
struct PersistedDailySession: Codable {
    let namedIds: [Int]
    let namedPlayers: [NamedPlayer]
    let lives: Int
    let complete: Bool
    let won: Bool
}
