import Foundation

public struct Player: Codable, Identifiable {
    public let id: Int
    public let first_name: String
    public let last_name: String
    public let display_first_last: String
    public var birthdate: Date? = nil
    public var school: String? = nil
    public var country: String? = nil
    public var height: String? = nil
    public var weight: Int? = nil
    public var season_exp: Int? = nil
    public var jersey: Int? = nil
    public var position: String? = nil
    public var team_history: String? = nil
    public var is_active: Bool? = nil
    public var from_year: Int? = nil
    public var to_year: Int? = nil
    public var total_games_played: Int? = nil
    public var draft_round: String? = nil
    public var draft_number: String? = nil
    public var draft_year: String? = nil
    public var career_ppg: Double? = nil
    public var career_rpg: Double? = nil
    public var career_apg: Double? = nil

    public init(id: Int, first_name: String, last_name: String) {
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.display_first_last = "\(first_name) \(last_name)"
    }
}
