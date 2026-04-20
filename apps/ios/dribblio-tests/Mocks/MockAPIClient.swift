import Foundation
@testable import dribblio

final class MockAPIClient: APIClientProtocol, @unchecked Sendable {
    var searchPlayersResult: Result<[PlayerSearchResult], Error> = .success([])
    var fetchDailyChallengeResult: Result<DailyChallengeDTO, Error> = .success(
        DailyChallengeDTO(
            challengeDate: "2026-04-17",
            teamId: 1,
            teamFullName: "Los Angeles Lakers",
            teamAbbreviation: "LAL",
            seasonId: "2023-24",
            rosterSize: 15
        )
    )
    var submitDailyGuessResult: Result<RosterGuessResponse, Error> = .success(.wrong(rosterSize: 15))
    var fetchEarliestDateResult: Result<String?, Error> = .success("2026-01-01")

    func searchPlayers(query: String) async throws -> [PlayerSearchResult] {
        try searchPlayersResult.get()
    }

    func fetchDailyChallenge(date: String) async throws -> DailyChallengeDTO {
        try fetchDailyChallengeResult.get()
    }

    func submitDailyGuess(date: String, guessId: Int, namedIds: [Int]) async throws -> RosterGuessResponse {
        try submitDailyGuessResult.get()
    }

    func fetchEarliestDate() async throws -> String? {
        try fetchEarliestDateResult.get()
    }
}
