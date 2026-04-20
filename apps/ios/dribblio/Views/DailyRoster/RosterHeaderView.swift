import SwiftUI

/// Displays team identity information at the top of a Daily Roster challenge.
///
/// Uses a monospaced abbreviation badge as a placeholder until team logo assets
/// are available. The badge adapts to Dark Mode via `.quaternary` fill.
///
/// - Example:
///   ```swift
///   RosterHeaderView(
///       teamFullName: "Los Angeles Lakers",
///       teamAbbreviation: "LAL",
///       seasonId: "2001-02"
///   )
///   ```
struct RosterHeaderView: View {

    /// The full franchise name, e.g. `"Los Angeles Lakers"`.
    let teamFullName: String

    /// The short abbreviation shown in the badge, e.g. `"LAL"`.
    let teamAbbreviation: String

    /// The NBA season identifier, e.g. `"2001-02"`.
    let seasonId: String

    // MARK: - Body

    var body: some View {
        VStack(spacing: 8) {
            abbreviationBadge
            Text(teamFullName)
                .font(.title3.weight(.bold)).fontDesign(.serif)
                .multilineTextAlignment(.center)
            Text(seasonId)
                .font(.caption)
                .foregroundStyle(.secondary)
                .padding(.horizontal, 12)
                .padding(.vertical, 4)
                .background(.ultraThinMaterial, in: Capsule())
        }
        .padding(.vertical, 16)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(teamFullName), \(seasonId) season")
    }

    // MARK: - Subviews

    /// Circular badge showing the team abbreviation until logo assets land.
    private var abbreviationBadge: some View {
        ZStack {
            Circle()
                .fill(.quaternary)
                .frame(width: 64, height: 64)
            Text(teamAbbreviation)
                .font(.system(.headline, design: .monospaced).weight(.bold))
        }
    }
}

// MARK: - Previews

#Preview("RosterHeaderView") {
    RosterHeaderView(
        teamFullName: "Los Angeles Lakers",
        teamAbbreviation: "LAL",
        seasonId: "2001-02"
    )
    .padding()
}

#Preview("RosterHeaderView — Dark") {
    RosterHeaderView(
        teamFullName: "Chicago Bulls",
        teamAbbreviation: "CHI",
        seasonId: "1995-96"
    )
    .padding()
    .preferredColorScheme(.dark)
}
