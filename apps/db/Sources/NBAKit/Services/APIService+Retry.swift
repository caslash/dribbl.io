import Foundation

public enum NBAEndpoint {
    case commonPlayerInfo
    case playerAwards
    case playerProfileV2

    var path: String {
        switch self {
        case .commonPlayerInfo: "commonplayerinfo"
        case .playerAwards: "playerawards"
        case .playerProfileV2: "playerprofilev2"
        }
    }

    var timeout: TimeInterval {
        switch self {
        case .commonPlayerInfo: 20
        case .playerAwards: 30
        case .playerProfileV2: 45
        }
    }

    func params(playerId: Int) -> [URLQueryItem] {
        switch self {
        case .commonPlayerInfo:
            [
                URLQueryItem(name: "LeagueID", value: "00"),
                URLQueryItem(name: "PlayerID", value: String(playerId)),
            ]
        case .playerAwards:
            [
                URLQueryItem(name: "PlayerID", value: String(playerId))
            ]
        case .playerProfileV2:
            [
                URLQueryItem(name: "PerMode", value: "PerGame"),
                URLQueryItem(name: "PlayerID", value: String(playerId)),
                URLQueryItem(name: "LeagueID", value: "00"),
            ]
        }
    }
}

public enum APIError: Error {
    case maxRetriesExceeded
    case rateLimited
    case proxyFailure
    case invalidResponse
}

extension APIService {
    public func fetchWithRetry<T: ResponseInitializable>(
        endpoint: NBAEndpoint,
        playerId: Int,
        proxy: Proxy? = nil,
        maxRetries: Int = 3
    ) async throws -> T {
        var lastError: Error?

        for attempt in 1...maxRetries {
            do {
                let result: T = try await get(
                    timeoutInterval: endpoint.timeout,
                    path: endpoint.path,
                    params: endpoint.params(playerId: playerId),
                    proxy: proxy
                )
                return result
            } catch {
                lastError = error

                if let urlError = error as? URLError {
                    switch urlError.code {
                    case .badURL, .unsupportedURL:
                        throw error
                    default:
                        break
                    }
                }

                if attempt < maxRetries {
                    let baseDelay = pow(2.0, Double(attempt))
                    let jitter = Double.random(in: 0...0.5)
                    let delay = min(baseDelay + jitter, 10.0)

                    print(
                        "Request failed for player \(playerId) (attempt \(attempt)/\(maxRetries)): \(error)"
                    )
                    print("Retrying in \(String(format: "%.1f", delay))s...")

                    try await Task.sleep(nanoseconds: UInt64(delay * 1_000_000_000))
                }
            }
        }

        throw lastError ?? APIError.maxRetriesExceeded
    }
}
