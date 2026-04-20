import SwiftUI

/// A compact pill displaying a stat label paired with its value (e.g. "PTS 27.1").
///
/// Renders nothing when `value` is `nil`, making it safe to pass optional stats
/// directly without conditional logic at the call site.
///
/// - Example:
///   ```swift
///   HStack {
///       StatPillView(label: "PTS", value: player.pointsPerGame)
///       StatPillView(label: "AST", value: player.assistsPerGame)
///       StatPillView(label: "REB", value: player.reboundsPerGame)
///   }
///   ```
struct StatPillView: View {

    /// Short uppercase label, e.g. `"PTS"`, `"AST"`, `"REB"`.
    let label: String

    /// The numeric value to display, formatted to one decimal place.
    /// Pass `nil` to render nothing (the view collapses to zero size).
    let value: Double?

    var body: some View {
        if let value {
            HStack(spacing: 3) {
                Text(label)
                    .font(.caption2.weight(.semibold))
                    .foregroundStyle(.secondary)
                Text(String(format: "%.1f", value))
                    .font(.caption2.weight(.bold))
                    .foregroundStyle(.primary)
            }
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(.ultraThinMaterial, in: Capsule())
            .accessibilityElement(children: .combine)
            .accessibilityLabel("\(label): \(String(format: "%.1f", value))")
        }
    }
}

// MARK: - Previews

#Preview("StatPillView") {
    HStack(spacing: 8) {
        StatPillView(label: "PTS", value: 27.1)
        StatPillView(label: "AST", value: 7.4)
        StatPillView(label: "REB", value: 10.2)
        StatPillView(label: "BLK", value: nil)
    }
    .padding()
}

#Preview("StatPillView — Dark") {
    HStack(spacing: 8) {
        StatPillView(label: "PTS", value: 38.4)
        StatPillView(label: "AST", value: 5.0)
    }
    .padding()
    .preferredColorScheme(.dark)
}
