import Foundation

// MARK: - Game State Enums

/// Represents the high-level phase of a Career Path game session.
enum GamePhase {
    case config, playing, gameOver
}

/// The outcome of a single guess or action in a Career Path round.
enum GuessResult {
    case correct, incorrect, skip
}

// MARK: - Configuration

/// Local configuration for a Career Path game session before it starts.
struct CareerPathConfig {
    /// `nil` means infinite lives mode.
    let lives: Int?
    let gameDifficulty: String
}

// MARK: - Socket Inbound Payloads

/// Payload for `NOTIFY_NEXT_ROUND` — server signals a new round is ready.
struct NotifyNextRound: Decodable {
    let score: Int
    let teamHistory: [String]?
    let lives: Int?

    enum CodingKeys: String, CodingKey {
        case score
        case teamHistory = "team_history"
        case lives
    }
}

/// Payload for `NOTIFY_CORRECT_GUESS` — server confirms the guess was correct.
struct NotifyCorrectGuess: Decodable {
    let validAnswers: [PlayerResult]
}

/// Payload for `NOTIFY_INCORRECT_GUESS` — server reports an incorrect guess.
struct NotifyIncorrectGuess: Decodable {
    let lives: Int?
    let score: Int
}

/// Payload for `NOTIFY_SKIP_ROUND` — server acknowledges a skipped round.
struct NotifySkipRound: Decodable {
    let lives: Int?
}

// MARK: - Internal Types

/// Buffers round data received from the server before the UI is ready to display it.
struct PendingRound {
    let score: Int
    let lives: Int?
    let teamHistory: [String]
}
