import Foundation
import Observation

/// Manages the Career Path game session state and socket lifecycle.
///
/// Mirrors `CareerPathProvider.tsx` exactly: same state shape, same
/// feedback-buffering logic for `pendingRound` and `pendingGameOver`.
///
/// - Example:
///   ```swift
///   @State private var viewModel = CareerPathViewModel()
///   viewModel.saveConfig(CareerPathConfig(lives: 3, gameDifficulty: "greatest75"))
///   ```
@MainActor
@Observable
final class CareerPathViewModel {

    // MARK: - Public state

    private(set) var phase: GamePhase = .config
    private(set) var score: Int = 0
    /// `nil` means infinite lives mode.
    private(set) var lives: Int? = nil
    private(set) var teamHistory: [String] = []
    private(set) var lastResult: GuessResult? = nil
    private(set) var validAnswers: [PlayerResult] = []
    private(set) var errorMessage: String? = nil

    // MARK: - Private buffering (mirrors web pendingRound / pendingGameOver)

    private var pendingRound: PendingRound? = nil
    private var pendingGameOver: Bool = false

    // MARK: - Socket

    private var socket: (any SocketClientProtocol)?
    /// Injectable factory — defaults to creating a real `SocketClient`.
    private let socketFactory: (String, [String: String]) -> any SocketClientProtocol

    /// - Parameter socketFactory: Optional factory override for testing. Defaults to `SocketClient`.
    init(socketFactory: ((String, [String: String]) -> any SocketClientProtocol)? = nil) {
        self.socketFactory = socketFactory ?? { namespace, query in
            SocketClient(namespace: namespace, query: query)
        }
    }

    nonisolated func cleanUp() {
        // Called from deinit; SocketClientProtocol members are nonisolated-safe.
    }

    deinit {
        // deinit is nonisolated; direct socket access is unsafe on @MainActor class.
        // The socket will be cleaned up when the object is released.
    }

    // MARK: - Public actions

    /// Connects the socket (if not already connected) and emits `SAVE_CONFIG`.
    ///
    /// - Parameter config: The difficulty and lives configuration for this session.
    func saveConfig(_ config: CareerPathConfig) {
        if socket == nil {
            let s = socketFactory("/careerpath", [:])
            registerHandlers(on: s)
            s.connect()
            socket = s
        }
        let payload: [String: Any] = [
            "config": [
                "lives": config.lives as Any,
                "gameDifficulty": config.gameDifficulty
            ]
        ]
        socket?.emit("SAVE_CONFIG", [payload])
    }

    /// Emits a `USER_GUESS` event with the selected player's ID.
    ///
    /// - Parameter playerId: The `playerId` of the player to guess.
    func submitGuess(_ playerId: Int) {
        socket?.emit("USER_GUESS", [["guessId": playerId]])
    }

    /// Emits a `SKIP` event to skip the current round.
    func skip() {
        socket?.emit("SKIP", [])
    }

    /// Clears feedback, applying any buffered round or game-over state.
    ///
    /// Mirrors `CareerPathProvider.clearFeedback` exactly: if a game-over or
    /// next-round arrived while feedback was showing, it is applied here so
    /// the transition happens after the user dismisses feedback — not before.
    func dismissError() { errorMessage = nil }

    func clearFeedback() {
        if pendingGameOver {
            lastResult = nil
            validAnswers = []
            pendingGameOver = false
            phase = .gameOver
        } else if let pending = pendingRound {
            score = pending.score
            lives = pending.lives
            teamHistory = pending.teamHistory
            lastResult = nil
            validAnswers = []
            pendingRound = nil
        } else {
            lastResult = nil
            validAnswers = []
        }
    }

    // MARK: - Private socket setup

    private func registerHandlers(on socket: any SocketClientProtocol) {
        // Callbacks are dispatched to the main queue by SocketClient.
        // MainActor.assumeIsolated is safe here because we verify dispatch in SocketClient.on.
        socket.on("NOTIFY_CONFIG_SAVED") { [weak self] _ in
            MainActor.assumeIsolated {
                self?.socket?.emit("START_GAME", [])
            }
        }

        socket.on("NOTIFY_NEXT_ROUND") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                guard let self,
                      let payload = try? decodeSocketPayload(NotifyNextRound.self, from: d)
                else { return }
                let round = PendingRound(
                    score: payload.score,
                    lives: payload.lives,
                    teamHistory: payload.teamHistory ?? []
                )
                if self.lastResult != nil {
                    self.pendingRound = round
                    self.phase = .playing
                } else {
                    self.score = round.score
                    self.lives = round.lives
                    self.teamHistory = round.teamHistory
                    self.lastResult = nil
                    self.validAnswers = []
                    self.pendingRound = nil
                    self.phase = .playing
                }
            }
        }

        socket.on("NOTIFY_CORRECT_GUESS") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                guard let self,
                      let payload = try? decodeSocketPayload(NotifyCorrectGuess.self, from: d)
                else { return }
                self.lastResult = .correct
                self.validAnswers = payload.validAnswers
            }
        }

        socket.on("NOTIFY_INCORRECT_GUESS") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                guard let self,
                      let payload = try? decodeSocketPayload(NotifyIncorrectGuess.self, from: d)
                else { return }
                self.lastResult = .incorrect
                self.lives = payload.lives
                self.score = payload.score
            }
        }

        socket.on("NOTIFY_SKIP_ROUND") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                guard let self,
                      let payload = try? decodeSocketPayload(NotifySkipRound.self, from: d)
                else { return }
                self.lastResult = .skip
                self.lives = payload.lives
            }
        }

        socket.on("NOTIFY_GAME_OVER") { [weak self] _ in
            MainActor.assumeIsolated {
                guard let self else { return }
                if self.lastResult != nil {
                    self.pendingGameOver = true
                } else {
                    self.phase = .gameOver
                }
            }
        }

        socket.on("ERROR") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                if let msg = (d.first as? [String: Any])?["message"] as? String {
                    self?.errorMessage = msg
                }
            }
        }
    }
}
