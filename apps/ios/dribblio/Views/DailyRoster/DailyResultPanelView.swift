import SwiftUI

/// A result summary card shown after the Daily Roster game ends.
///
/// Displays win/loss state, named count, and a `ShareLink` so users can share
/// their result to any share sheet destination. `ShareLink` is the native API
/// (iOS 16+) — no custom share sheet needed.
struct DailyResultPanelView: View {
    let won: Bool
    let namedCount: Int
    let rosterSize: Int
    let teamFullName: String
    let seasonId: String
    let lives: Int

    private var shareText: String {
        let emoji = won ? "🏀" : "❌"
        let result = won ? "Named all \(rosterSize) players!" : "Named \(namedCount)/\(rosterSize) players"
        return "\(emoji) dribbl.io Daily Roster — \(teamFullName) (\(seasonId))\n\(result)\nhttps://dribbl.io/daily"
    }

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: won ? "trophy.fill" : "flag.fill")
                .font(.system(size: 56))
                .foregroundStyle(won ? .yellow : .secondary)
                .accessibilityHidden(true)

            Text(won ? "You got it!" : "Game Over")
                .font(.title.weight(.bold))
                .fontDesign(.serif)

            Text("\(namedCount) of \(rosterSize) players named")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            ShareLink(item: shareText) {
                Label("Share Result", systemImage: "square.and.arrow.up")
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
            }
            .buttonStyle(.borderedProminent)
            .tint(won ? .accentColor : .secondary)
        }
        .padding(24)
        .glassCard(cornerRadius: 16, interactive: false)
        .padding(.horizontal)
        .accessibilityElement(children: .contain)
        .accessibilityLabel(won ? "You won! \(namedCount) of \(rosterSize) players named." : "Game over. \(namedCount) of \(rosterSize) players named.")
    }
}

// MARK: - Previews

#Preview("DailyResultPanelView — Won") {
    DailyResultPanelView(
        won: true,
        namedCount: 12,
        rosterSize: 12,
        teamFullName: "Los Angeles Lakers",
        seasonId: "2000-01",
        lives: 2
    )
    .padding()
}

#Preview("DailyResultPanelView — Lost") {
    DailyResultPanelView(
        won: false,
        namedCount: 7,
        rosterSize: 12,
        teamFullName: "Chicago Bulls",
        seasonId: "1995-96",
        lives: 0
    )
    .padding()
}
