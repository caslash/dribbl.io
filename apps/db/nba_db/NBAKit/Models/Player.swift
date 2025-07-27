import Foundation

public struct Player: Codable {
    public let id: Int
    public let first_name: String
    public let last_name: String
    public let birthdate: Date
    public let school: String
    public let country: String
    public let height: String
    public let weight: Int
    public let season_exp: Int
    public let jersey: Int?
    public let position: String
    public let team_history: String
    public let is_active: Bool
    public let from_year: Int
    public let to_year: Int
    public let total_games_played: Int
    public let draft_round: String
    public let draft_number: String
    public let draft_year: String
    public let career_ppg: Double
    public let career_rpg: Double
    public let career_apg: Double
}
