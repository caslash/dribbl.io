import Foundation
import Observation

/// Manages state for a single Daily Roster Challenge session keyed by date.
///
/// Mirrors the behavior of `DailyRosterProvider.tsx` exactly: fetches the
/// challenge on init, restores any persisted session from `UserDefaults`, and
/// exposes `submitGuess` as the sole mutation entry point.
///
/// - Note: `@MainActor` ensures all state mutations happen on the main thread,
///   which is required because `@Observable` properties drive SwiftUI updates.
///
/// - Example:
///   ```swift
///   let vm = DailyRosterViewModel(date: "2026-04-15")
///   let outcome = await vm.submitGuess(2544)
///   ```
@MainActor
@Observable
final class DailyRosterViewModel {

    // MARK: - Public state

    private(set) var phase: DailyPhase = .loading
    private(set) var challenge: DailyChallengeDTO? = nil
    private(set) var namedPlayers: [NamedPlayer] = []
    private(set) var lives: Int = 3
    private(set) var complete: Bool = false
    private(set) var won: Bool = false
    private(set) var error: DailyError? = nil

    // MARK: - Dependencies

    /// The `YYYY-MM-DD` date string this session is bound to.
    let date: String
    // nonisolated(unsafe) because APIClientProtocol is not Sendable — APIClient is a
    // reference type accessed only from async contexts that hop to the main actor.
    nonisolated(unsafe) private let apiClient: any APIClientProtocol
    nonisolated(unsafe) private let defaults: UserDefaults

    private var storageKey: String { UserDefaultsKeys.dailyRoster(date: date) }

    /// - Parameters:
    ///   - date: A `YYYY-MM-DD` string identifying the challenge day.
    ///   - apiClient: The API client to use. Defaults to `APIClient.shared`.
    ///   - defaults: The `UserDefaults` suite to persist session state in. Defaults to `.standard`.
    init(
        date: String,
        apiClient: any APIClientProtocol = APIClient.shared,
        defaults: UserDefaults = .standard
    ) {
        self.date = date
        self.apiClient = apiClient
        self.defaults = defaults
        Task { await fetchChallenge() }
    }

    // MARK: - Public actions

    /// Fetches the challenge for `date` and restores any persisted session state.
    ///
    /// Called automatically on init. Can also be called to retry after a network error.
    func fetchChallenge() async {
        do {
            let client = apiClient
            let dto = try await client.fetchDailyChallenge(date: date)

            if let persisted = loadPersistedSession() {
                let isComplete = persisted.complete
                phase = isComplete ? .complete : .playing
                challenge = dto
                namedPlayers = persisted.namedPlayers
                lives = persisted.lives
                complete = persisted.complete
                won = persisted.won
                error = nil
            } else {
                phase = .playing
                challenge = dto
                namedPlayers = []
                lives = 3
                complete = false
                won = false
                error = nil
            }
        } catch NetworkError.noChallenge {
            phase = .playing
            error = .noChallenge
        } catch {
            phase = .playing
            self.error = .networkError
        }
    }

    /// Submits a player guess to the server and mutates session state accordingly.
    ///
    /// - Parameter playerId: The NBA player ID to guess.
    /// - Returns: The outcome of the guess.
    func submitGuess(_ playerId: Int) async -> GuessOutcome {
        let namedIds = namedPlayers.map(\.playerId)

        do {
            let client = apiClient
            let response = try await client.submitDailyGuess(date: date, guessId: playerId, namedIds: namedIds)

            switch response {
            case .duplicate:
                return .duplicate

            case .correct(let player, let index, _, let rosterSize):
                let incoming = NamedPlayer(
                    playerId: player.playerId,
                    fullName: player.fullName,
                    position: player.position,
                    jerseyNumber: player.jerseyNumber,
                    ptsPg: player.ptsPg,
                    astPg: player.astPg,
                    rebPg: player.rebPg,
                    index: index
                )
                var updated = namedPlayers + [incoming]
                updated.sort { $0.index < $1.index }
                let didWin = updated.count == rosterSize
                namedPlayers = updated
                complete = didWin
                won = didWin
                if didWin { phase = .complete }
                persistSession()
                return .correct

            case .wrong:
                let newLives = lives - 1
                let lost = newLives <= 0
                lives = newLives
                if lost {
                    complete = true
                    won = false
                    phase = .complete
                }
                persistSession()
                return .wrong

            case .noChallenge:
                error = .noChallenge
                return .wrong
            }
        } catch {
            self.error = .networkError
            return .wrong
        }
    }

    // MARK: - Persistence

    private func loadPersistedSession() -> PersistedDailySession? {
        guard let data = defaults.data(forKey: storageKey) else { return nil }
        return try? JSONDecoder().decode(PersistedDailySession.self, from: data)
    }

    private func persistSession() {
        let session = PersistedDailySession(
            namedIds: namedPlayers.map(\.playerId),
            namedPlayers: namedPlayers,
            lives: lives,
            complete: complete,
            won: won
        )
        if let data = try? JSONEncoder().encode(session) {
            defaults.set(data, forKey: storageKey)
        }
    }
}
