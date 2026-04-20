import Testing
import Foundation
@testable import dribblio

@MainActor
@Suite("CareerPathViewModel")
struct CareerPathViewModelTests {

    // MARK: - Helpers

    func makeVM() -> (CareerPathViewModel, MockSocketClient) {
        let mock = MockSocketClient()
        let vm = CareerPathViewModel(socketFactory: { _, _ in mock })
        return (vm, mock)
    }

    // MARK: - Connection & Config

    @Test("saveConfig connects socket and emits SAVE_CONFIG")
    func saveConfig_connectsAndEmits() {
        let (vm, mock) = makeVM()
        vm.saveConfig(CareerPathConfig(lives: 3, gameDifficulty: "greatest75"))
        #expect(mock.isConnected)
        #expect(mock.wasEmitted("SAVE_CONFIG"))
    }

    @Test("NOTIFY_CONFIG_SAVED triggers START_GAME")
    func notifyConfigSaved_emitsStartGame() {
        let (vm, mock) = makeVM()
        vm.saveConfig(CareerPathConfig(lives: nil, gameDifficulty: "allNBA"))
        mock.simulateEvent("NOTIFY_CONFIG_SAVED")
        #expect(mock.wasEmitted("START_GAME"))
    }

    // MARK: - Round Handling

    @Test("NOTIFY_NEXT_ROUND applies state when no feedback active")
    func notifyNextRound_appliesDirectly() throws {
        let (vm, mock) = makeVM()
        vm.saveConfig(CareerPathConfig(lives: 5, gameDifficulty: "greatest75"))

        let payload: [String: Any] = ["score": 3, "team_history": ["LAL", "MIA"], "lives": 4]
        let jsonData = try JSONSerialization.data(withJSONObject: payload)
        let jsonObj = try JSONSerialization.jsonObject(with: jsonData)
        mock.simulateEvent("NOTIFY_NEXT_ROUND", data: [jsonObj])

        #expect(vm.score == 3)
        #expect(vm.teamHistory == ["LAL", "MIA"])
        #expect(vm.lives == 4)
        #expect(vm.phase == .playing)
    }

    @Test("NOTIFY_NEXT_ROUND buffers when feedback is active")
    func notifyNextRound_buffersWhenFeedbackActive() throws {
        let (vm, mock) = makeVM()
        vm.saveConfig(CareerPathConfig(lives: 3, gameDifficulty: "greatest75"))

        // Trigger feedback by simulating a correct guess
        let correctPayload: [String: Any] = [
            "validAnswers": [
                ["playerId": 1, "fullName": "LeBron James", "firstName": "LeBron", "lastName": "James"]
            ]
        ]
        let correctData = try JSONSerialization.data(withJSONObject: correctPayload)
        let correctObj = try JSONSerialization.jsonObject(with: correctData)
        mock.simulateEvent("NOTIFY_CORRECT_GUESS", data: [correctObj])
        #expect(vm.lastResult == .correct)

        // Now simulate next round — should be buffered rather than applied
        let roundPayload: [String: Any] = ["score": 1, "team_history": ["BOS"], "lives": 3]
        let roundData = try JSONSerialization.data(withJSONObject: roundPayload)
        let roundObj = try JSONSerialization.jsonObject(with: roundData)
        mock.simulateEvent("NOTIFY_NEXT_ROUND", data: [roundObj])

        #expect(vm.teamHistory != ["BOS"])
        #expect(vm.lastResult == .correct) // feedback still showing; round not applied yet
    }

    // MARK: - Correct / Incorrect / Skip

    @Test("NOTIFY_CORRECT_GUESS sets lastResult and validAnswers")
    func notifyCorrectGuess_setsState() throws {
        let (vm, mock) = makeVM()
        vm.saveConfig(CareerPathConfig(lives: nil, gameDifficulty: "greatest75"))

        let payload: [String: Any] = [
            "validAnswers": [
                ["playerId": 23, "fullName": "LeBron James", "firstName": "LeBron", "lastName": "James"]
            ]
        ]
        let data = try JSONSerialization.data(withJSONObject: payload)
        let obj = try JSONSerialization.jsonObject(with: data)
        mock.simulateEvent("NOTIFY_CORRECT_GUESS", data: [obj])

        #expect(vm.lastResult == .correct)
        #expect(vm.validAnswers.count == 1)
        #expect(vm.validAnswers[0].fullName == "LeBron James")
    }

    @Test("NOTIFY_INCORRECT_GUESS sets lastResult and remaining lives")
    func notifyIncorrectGuess_setsState() throws {
        let (vm, mock) = makeVM()
        vm.saveConfig(CareerPathConfig(lives: 3, gameDifficulty: "greatest75"))

        let payload: [String: Any] = ["lives": 2, "score": 0]
        let data = try JSONSerialization.data(withJSONObject: payload)
        let obj = try JSONSerialization.jsonObject(with: data)
        mock.simulateEvent("NOTIFY_INCORRECT_GUESS", data: [obj])

        #expect(vm.lastResult == .incorrect)
        #expect(vm.lives == 2)
    }

    // MARK: - Game Over

    @Test("NOTIFY_GAME_OVER transitions immediately when no feedback active")
    func notifyGameOver_transitionsImmediately() {
        let (vm, mock) = makeVM()
        vm.saveConfig(CareerPathConfig(lives: 3, gameDifficulty: "greatest75"))
        mock.simulateEvent("NOTIFY_GAME_OVER")
        #expect(vm.phase == .gameOver)
    }

    @Test("NOTIFY_GAME_OVER buffers when feedback is active")
    func notifyGameOver_buffersWhenFeedbackActive() throws {
        let (vm, mock) = makeVM()
        vm.saveConfig(CareerPathConfig(lives: 1, gameDifficulty: "greatest75"))

        let incorrectPayload: [String: Any] = ["lives": 0, "score": 0]
        let data = try JSONSerialization.data(withJSONObject: incorrectPayload)
        let obj = try JSONSerialization.jsonObject(with: data)
        mock.simulateEvent("NOTIFY_INCORRECT_GUESS", data: [obj])
        #expect(vm.lastResult == .incorrect)

        mock.simulateEvent("NOTIFY_GAME_OVER")
        // Game over is buffered while feedback is showing
        #expect(vm.phase != .gameOver)
    }

    // MARK: - clearFeedback

    @Test("clearFeedback applies pending round")
    func clearFeedback_appliesPendingRound() throws {
        let (vm, mock) = makeVM()
        vm.saveConfig(CareerPathConfig(lives: 3, gameDifficulty: "greatest75"))

        // Enter feedback state via a correct guess
        let correctPayload: [String: Any] = ["validAnswers": []]
        let cData = try JSONSerialization.data(withJSONObject: correctPayload)
        let cObj = try JSONSerialization.jsonObject(with: cData)
        mock.simulateEvent("NOTIFY_CORRECT_GUESS", data: [cObj])

        // Buffer a next round while feedback is active
        let roundPayload: [String: Any] = ["score": 1, "team_history": ["GSW", "LAL"], "lives": 3]
        let rData = try JSONSerialization.data(withJSONObject: roundPayload)
        let rObj = try JSONSerialization.jsonObject(with: rData)
        mock.simulateEvent("NOTIFY_NEXT_ROUND", data: [rObj])

        vm.clearFeedback()

        #expect(vm.lastResult == nil)
        #expect(vm.teamHistory == ["GSW", "LAL"])
        #expect(vm.score == 1)
    }

    @Test("clearFeedback transitions to gameOver when pendingGameOver is set")
    func clearFeedback_gameOver() throws {
        let (vm, mock) = makeVM()
        vm.saveConfig(CareerPathConfig(lives: 1, gameDifficulty: "greatest75"))

        let incorrectPayload: [String: Any] = ["lives": 0, "score": 0]
        let data = try JSONSerialization.data(withJSONObject: incorrectPayload)
        let obj = try JSONSerialization.jsonObject(with: data)
        mock.simulateEvent("NOTIFY_INCORRECT_GUESS", data: [obj])
        mock.simulateEvent("NOTIFY_GAME_OVER")

        vm.clearFeedback()
        #expect(vm.phase == .gameOver)
    }

    // MARK: - User Actions

    @Test("skip emits SKIP event")
    func skip_emitsEvent() {
        let (vm, mock) = makeVM()
        vm.saveConfig(CareerPathConfig(lives: nil, gameDifficulty: "greatest75"))
        vm.skip()
        #expect(mock.wasEmitted("SKIP"))
    }

    @Test("submitGuess emits USER_GUESS with correct playerId")
    func submitGuess_emitsEvent() {
        let (vm, mock) = makeVM()
        vm.saveConfig(CareerPathConfig(lives: nil, gameDifficulty: "greatest75"))
        vm.submitGuess(2544)
        let payload = mock.dataFor("USER_GUESS")?.first as? [String: Any]
        #expect(payload?["guessId"] as? Int == 2544)
    }
}
