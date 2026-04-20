import Testing
import Foundation
@testable import dribblio

@MainActor
@Suite("DailyRosterViewModel")
struct DailyRosterViewModelTests {

    // MARK: - Fixtures

    let mockChallenge = DailyChallengeDTO(
        challengeDate: "2026-04-17",
        teamId: 1,
        teamFullName: "Los Angeles Lakers",
        teamAbbreviation: "LAL",
        seasonId: "2000-01",
        rosterSize: 3
    )

    let mockPlayer = RosterGuessPlayerDTO(
        playerId: 23,
        fullName: "Kobe Bryant",
        position: "SG",
        jerseyNumber: "8",
        ptsPg: 28.5,
        astPg: 5.0,
        rebPg: 5.9
    )

    // MARK: - fetchChallenge

    @Test("fetchChallenge sets playing phase and challenge on success")
    func fetchChallenge_success() async {
        let api = MockAPIClient()
        api.fetchDailyChallengeResult = .success(mockChallenge)
        let vm = DailyRosterViewModel(
            date: "2026-04-17",
            apiClient: api,
            defaults: UserDefaults(suiteName: UUID().uuidString)!
        )

        // Allow the init Task to complete
        try? await Task.sleep(for: .milliseconds(100))

        #expect(vm.phase == .playing)
        #expect(vm.challenge?.teamFullName == "Los Angeles Lakers")
        #expect(vm.lives == 3)
    }

    @Test("fetchChallenge sets noChallenge error on NetworkError.noChallenge")
    func fetchChallenge_noChallenge() async {
        let api = MockAPIClient()
        api.fetchDailyChallengeResult = .failure(NetworkError.noChallenge)
        let vm = DailyRosterViewModel(
            date: "2026-04-17",
            apiClient: api,
            defaults: UserDefaults(suiteName: UUID().uuidString)!
        )

        try? await Task.sleep(for: .milliseconds(100))

        #expect(vm.error == .noChallenge)
    }

    @Test("fetchChallenge restores persisted session from UserDefaults")
    func fetchChallenge_restoresSession() async throws {
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        let namedPlayer = NamedPlayer(
            playerId: 23,
            fullName: "Kobe Bryant",
            position: "SG",
            jerseyNumber: "8",
            ptsPg: 28.5,
            astPg: 5.0,
            rebPg: 5.9,
            index: 0
        )
        let session = PersistedDailySession(
            namedIds: [23],
            namedPlayers: [namedPlayer],
            lives: 2,
            complete: false,
            won: false
        )
        let data = try JSONEncoder().encode(session)
        defaults.set(data, forKey: "daily_roster_v2_2026-04-17")

        let api = MockAPIClient()
        api.fetchDailyChallengeResult = .success(mockChallenge)
        let vm = DailyRosterViewModel(date: "2026-04-17", apiClient: api, defaults: defaults)

        try? await Task.sleep(for: .milliseconds(100))

        #expect(vm.namedPlayers.count == 1)
        #expect(vm.lives == 2)
        #expect(vm.namedPlayers[0].fullName == "Kobe Bryant")
    }

    // MARK: - submitGuess: correct

    @Test("submitGuess correct appends player and persists session")
    func submitGuess_correct() async throws {
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        let api = MockAPIClient()
        api.fetchDailyChallengeResult = .success(mockChallenge)
        api.submitDailyGuessResult = .success(
            .correct(player: mockPlayer, index: 0, namedIds: [23], rosterSize: 3)
        )
        let vm = DailyRosterViewModel(date: "2026-04-17", apiClient: api, defaults: defaults)
        try? await Task.sleep(for: .milliseconds(100))

        let outcome = await vm.submitGuess(23)

        #expect(outcome == .correct)
        #expect(vm.namedPlayers.count == 1)
        #expect(vm.namedPlayers[0].fullName == "Kobe Bryant")
        #expect(defaults.data(forKey: "daily_roster_v2_2026-04-17") != nil)
    }

    @Test("submitGuess correct wins when named player count equals rosterSize")
    func submitGuess_winsWhenFull() async {
        let api = MockAPIClient()
        api.fetchDailyChallengeResult = .success(DailyChallengeDTO(
            challengeDate: "2026-04-17",
            teamId: 1,
            teamFullName: "LAL",
            teamAbbreviation: "LAL",
            seasonId: "2000-01",
            rosterSize: 1
        ))
        api.submitDailyGuessResult = .success(
            .correct(player: mockPlayer, index: 0, namedIds: [23], rosterSize: 1)
        )
        let vm = DailyRosterViewModel(
            date: "2026-04-17",
            apiClient: api,
            defaults: UserDefaults(suiteName: UUID().uuidString)!
        )
        try? await Task.sleep(for: .milliseconds(100))

        let outcome = await vm.submitGuess(23)

        #expect(outcome == .correct)
        #expect(vm.complete == true)
        #expect(vm.won == true)
        #expect(vm.phase == .complete)
    }

    // MARK: - submitGuess: wrong

    @Test("submitGuess wrong decrements lives")
    func submitGuess_wrong_decrementsLives() async {
        let api = MockAPIClient()
        api.fetchDailyChallengeResult = .success(mockChallenge)
        api.submitDailyGuessResult = .success(.wrong(rosterSize: 3))
        let vm = DailyRosterViewModel(
            date: "2026-04-17",
            apiClient: api,
            defaults: UserDefaults(suiteName: UUID().uuidString)!
        )
        try? await Task.sleep(for: .milliseconds(100))

        let outcome = await vm.submitGuess(99)

        #expect(outcome == .wrong)
        #expect(vm.lives == 2)
    }

    @Test("submitGuess wrong on last life sets complete, won = false, and complete phase")
    func submitGuess_wrong_lastLife() async throws {
        let api = MockAPIClient()
        api.fetchDailyChallengeResult = .success(mockChallenge)
        api.submitDailyGuessResult = .success(.wrong(rosterSize: 3))

        // Pre-seed 1 life remaining in UserDefaults
        let defaults = UserDefaults(suiteName: UUID().uuidString)!
        let session = PersistedDailySession(namedIds: [], namedPlayers: [], lives: 1, complete: false, won: false)
        let data = try JSONEncoder().encode(session)
        defaults.set(data, forKey: "daily_roster_v2_2026-04-17")

        let vm = DailyRosterViewModel(date: "2026-04-17", apiClient: api, defaults: defaults)
        try? await Task.sleep(for: .milliseconds(100))

        let outcome = await vm.submitGuess(99)

        #expect(outcome == .wrong)
        #expect(vm.lives == 0)
        #expect(vm.complete == true)
        #expect(vm.won == false)
        #expect(vm.phase == .complete)
    }

    // MARK: - submitGuess: duplicate

    @Test("submitGuess duplicate returns .duplicate without mutating game state")
    func submitGuess_duplicate() async {
        let api = MockAPIClient()
        api.fetchDailyChallengeResult = .success(mockChallenge)
        api.submitDailyGuessResult = .success(.duplicate(player: mockPlayer))
        let vm = DailyRosterViewModel(
            date: "2026-04-17",
            apiClient: api,
            defaults: UserDefaults(suiteName: UUID().uuidString)!
        )
        try? await Task.sleep(for: .milliseconds(100))

        let countBefore = vm.namedPlayers.count
        let outcome = await vm.submitGuess(23)

        #expect(outcome == .duplicate)
        #expect(vm.namedPlayers.count == countBefore)
        #expect(vm.lives == 3) // unchanged
    }
}
