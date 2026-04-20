import SwiftUI

/// Horizontally scrolling sequence of team abbreviation chips with chevron separators.
///
/// Each chip renders the abbreviation in a monospaced bold headline font inside a
/// glass card. Chevrons between chips indicate career progression direction.
struct TeamHistoryView: View {

    let teamHistory: [String]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Career Path")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
                .padding(.horizontal)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 6) {
                    ForEach(Array(teamHistory.enumerated()), id: \.offset) { index, abbr in
                        if index > 0 {
                            Image(systemName: "chevron.right")
                                .font(.caption2)
                                .foregroundStyle(.secondary)
                                .accessibilityHidden(true)
                        }
                        Text(abbr)
                            .font(.system(.headline, design: .monospaced).weight(.bold))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 10)
                            .glassCard(cornerRadius: 8, interactive: false)
                            .accessibilityLabel(abbr)
                    }
                }
                .padding(.horizontal)
            }
            .accessibilityElement(children: .combine)
            .accessibilityLabel(teamHistory.joined(separator: ", then "))
        }
    }
}

// MARK: - Previews

#Preview("TeamHistory — Multi-team") {
    TeamHistoryView(teamHistory: ["LAL", "MIA", "CLE", "LAL", "LAL"])
        .padding(.vertical)
}

#Preview("TeamHistory — Single team") {
    TeamHistoryView(teamHistory: ["GSW"])
        .padding(.vertical)
}

#Preview("TeamHistory — Dark") {
    TeamHistoryView(teamHistory: ["BOS", "LAL", "CHI"])
        .padding(.vertical)
        .preferredColorScheme(.dark)
}
