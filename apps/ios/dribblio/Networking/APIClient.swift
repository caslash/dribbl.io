import Foundation

// MARK: - Protocol

/// Defines the API surface for all REST calls to the dribbl.io backend.
/// Conforming to a protocol enables test injection without hitting the network.
protocol APIClientProtocol: Sendable {
    /// Searches for NBA players matching the given query string.
    ///
    /// - Parameter query: The search term (partial name, etc.)
    /// - Returns: An array of matching player results.
    func searchPlayers(query: String) async throws -> [PlayerSearchResult]

    /// Fetches the daily roster challenge for a given date.
    ///
    /// - Parameter date: A `YYYY-MM-DD` date string.
    /// - Returns: The challenge DTO for that date.
    /// - Throws: `NetworkError.noChallenge` if no challenge exists for the date.
    func fetchDailyChallenge(date: String) async throws -> DailyChallengeDTO

    /// Submits a guess for the daily roster challenge.
    ///
    /// - Parameters:
    ///   - date: A `YYYY-MM-DD` date string identifying the challenge.
    ///   - guessId: The player ID being guessed.
    ///   - namedIds: The IDs of players already correctly named in this session.
    /// - Returns: A `RosterGuessResponse` discriminated union describing the outcome.
    func submitDailyGuess(date: String, guessId: Int, namedIds: [Int]) async throws -> RosterGuessResponse

    /// Fetches the earliest date for which a daily challenge exists.
    ///
    /// - Returns: A `YYYY-MM-DD` string, or `nil` if unavailable.
    func fetchEarliestDate() async throws -> String?
}

// MARK: - Implementation

/// Concrete HTTP client for the dribbl.io REST API.
///
/// - Note: Uses `URLSession` with `async/await`. All methods throw `NetworkError` on failure.
///
/// @example
/// ```swift
/// let challenge = try await APIClient.shared.fetchDailyChallenge(date: "2026-04-15")
/// ```
final class APIClient: APIClientProtocol, @unchecked Sendable {

    /// Shared singleton suitable for use throughout the app.
    static let shared = APIClient()

    private let session: URLSession
    private let baseURL: URL
    private let decoder: JSONDecoder

    /// - Parameters:
    ///   - session: The `URLSession` to use for requests. Defaults to `.shared`.
    ///   - baseURL: The backend base URL. Defaults to `Bundle.main.backendURL`.
    init(session: URLSession = .shared, baseURL: URL = Bundle.main.backendURL) {
        self.session = session
        self.baseURL = baseURL
        self.decoder = JSONDecoder()
        self.decoder.keyDecodingStrategy = .convertFromSnakeCase
    }

    // MARK: - APIClientProtocol

    func searchPlayers(query: String) async throws -> [PlayerSearchResult] {
        var components = URLComponents(url: baseURL.appendingPathComponent("api/players"), resolvingAgainstBaseURL: false)!
        components.queryItems = [URLQueryItem(name: "search", value: query)]
        let request = URLRequest(url: components.url!)
        return try await perform(request)
    }

    func fetchDailyChallenge(date: String) async throws -> DailyChallengeDTO {
        let url = baseURL.appendingPathComponent("api/daily/roster/\(date)")
        let request = URLRequest(url: url)
        return try await perform(request, treat404As: .noChallenge)
    }

    func submitDailyGuess(date: String, guessId: Int, namedIds: [Int]) async throws -> RosterGuessResponse {
        let url = baseURL.appendingPathComponent("api/daily/roster/\(date)/guess")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let body = ["guessId": guessId, "namedIds": namedIds] as [String: Any]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        // RosterGuessResponse has its own custom init(from:) — use standard decoder (no snake_case strategy needed here)
        return try await performWithDecoder(JSONDecoder(), request: request, treat404As: .noChallenge)
    }

    func fetchEarliestDate() async throws -> String? {
        let url = baseURL.appendingPathComponent("api/daily/roster/earliest-date")
        let request = URLRequest(url: url)
        let (data, response) = try await session.data(for: request)
        try validate(response: response)
        // The endpoint may return a bare string (date) or null
        if let str = String(data: data, encoding: .utf8)?.trimmingCharacters(in: .whitespacesAndNewlines),
           !str.isEmpty, str != "null" {
            // Strip surrounding quotes if the API returns a JSON string literal
            return str.trimmingCharacters(in: CharacterSet(charactersIn: "\""))
        }
        return nil
    }

    // MARK: - Helpers

    /// Performs a request and decodes the response body with `self.decoder`.
    private func perform<T: Decodable>(_ request: URLRequest, treat404As error: NetworkError? = nil) async throws -> T {
        try await performWithDecoder(decoder, request: request, treat404As: error)
    }

    /// Performs a request and decodes using an explicit decoder instance.
    private func performWithDecoder<T: Decodable>(_ decoder: JSONDecoder, request: URLRequest, treat404As notFoundError: NetworkError? = nil) async throws -> T {
        let (data, response) = try await session.data(for: request)
        do {
            try validate(response: response, treat404As: notFoundError)
        } catch {
            throw error
        }
        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            throw NetworkError.decodingError(error)
        }
    }

    /// Validates the HTTP response, converting non-2xx status codes to `NetworkError`.
    private func validate(response: URLResponse, treat404As notFoundError: NetworkError? = nil) throws {
        guard let http = response as? HTTPURLResponse else { return }
        if http.statusCode == 404, let override = notFoundError {
            throw override
        }
        guard (200..<300).contains(http.statusCode) else {
            throw NetworkError.httpError(http.statusCode)
        }
    }
}
