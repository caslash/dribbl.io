import Foundation

extension Bundle {
    /// Base URL for all API and Socket.io connections.
    /// Reads `BACKEND_URL` from Info.plist; falls back to localhost for debug builds.
    var backendURL: URL {
        guard
            let raw = infoDictionary?["BACKEND_URL"] as? String,
            !raw.isEmpty,
            let url = URL(string: raw)
        else {
            return URL(string: "http://localhost:3001")!
        }
        return url
    }
}
