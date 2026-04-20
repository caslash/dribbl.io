import Foundation

extension Date {
    /// Returns today's date as a `YYYY-MM-DD` string in the local timezone.
    ///
    /// @example
    /// ```swift
    /// let today = Date.localDateString() // e.g. "2026-04-15"
    /// ```
    static func localDateString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.locale = Locale(identifier: "en_US_POSIX")
        return formatter.string(from: Date())
    }

    /// Shifts a `YYYY-MM-DD` date string by the given number of days.
    ///
    /// - Parameters:
    ///   - dateString: A `YYYY-MM-DD` string to shift.
    ///   - days: Positive values advance the date; negative values go backwards.
    /// - Returns: The shifted date as a `YYYY-MM-DD` string, or `nil` if parsing fails.
    ///
    /// @example
    /// ```swift
    /// let tomorrow = Date.shiftDateString("2026-04-15", by: 1)  // "2026-04-16"
    /// let yesterday = Date.shiftDateString("2026-04-15", by: -1) // "2026-04-14"
    /// ```
    static func shiftDateString(_ dateString: String, by days: Int) -> String? {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.locale = Locale(identifier: "en_US_POSIX")
        guard let date = formatter.date(from: dateString) else { return nil }
        let shifted = Calendar.current.date(byAdding: .day, value: days, to: date)
        return shifted.map { formatter.string(from: $0) }
    }
}
