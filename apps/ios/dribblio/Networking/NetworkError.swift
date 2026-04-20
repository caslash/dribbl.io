import Foundation

enum NetworkError: Error, LocalizedError {
    case httpError(Int)
    case decodingError(Error)
    case networkUnavailable
    case noChallenge

    var errorDescription: String? {
        switch self {
        case .httpError(let code): return "Server returned HTTP \(code)"
        case .decodingError(let err): return "Failed to decode response: \(err.localizedDescription)"
        case .networkUnavailable: return "Network unavailable"
        case .noChallenge: return "No challenge available for this date"
        }
    }
}
