import Foundation

/// A lightweight player result returned from the search endpoint.
struct PlayerSearchResult: Codable, Identifiable {
    let playerId: Int
    let fullName: String

    var id: Int { playerId }
}

/// Full player record used in career path guess responses.
struct PlayerResult: Codable {
    let playerId: Int
    let fullName: String
    let firstName: String
    let lastName: String
}

/// A player on the daily roster, enriched with per-game stats and roster position.
struct NamedPlayer: Codable, Identifiable {
    let playerId: Int
    let fullName: String
    let position: String?
    let jerseyNumber: String?
    let ptsPg: Double?
    let astPg: Double?
    let rebPg: Double?
    /// 0-based sorted position in the roster.
    let index: Int

    var id: Int { playerId }
}
