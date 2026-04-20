import Foundation

/// Centralised `UserDefaults` key factory.
/// Using a typed factory prevents key typos and makes key collisions visible at a glance.
enum UserDefaultsKeys {
    /// Key for the persisted daily roster session for a given date.
    ///
    /// - Parameter date: A `YYYY-MM-DD` date string.
    /// - Returns: The `UserDefaults` key for that date's session.
    ///
    /// @example
    /// ```swift
    /// let key = UserDefaultsKeys.dailyRoster(date: "2026-04-15")
    /// UserDefaults.standard.set(encoded, forKey: key)
    /// ```
    static func dailyRoster(date: String) -> String {
        "daily_roster_v2_\(date)"
    }
}
