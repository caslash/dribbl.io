import SwiftUI

/// Post-game screen for the Daily Roster challenge.
///
/// Shows the result panel and a full scrollable list of named players.
/// Named players are always shown without the `missed` flag here because
/// the complete view celebrates correct guesses regardless of outcome.
struct DailyRosterCompleteView: View {
    let viewModel: DailyRosterViewModel

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                if let challenge = viewModel.challenge {
                    RosterHeaderView(
                        teamFullName: challenge.teamFullName,
                        teamAbbreviation: challenge.teamAbbreviation,
                        seasonId: challenge.seasonId
                    )

                    DailyResultPanelView(
                        won: viewModel.won,
                        namedCount: viewModel.namedPlayers.count,
                        rosterSize: challenge.rosterSize,
                        teamFullName: challenge.teamFullName,
                        seasonId: challenge.seasonId,
                        lives: viewModel.lives
                    )
                }

                if !viewModel.namedPlayers.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("NAMED (\(viewModel.namedPlayers.count))")
                            .font(.caption2.weight(.semibold))
                            .foregroundStyle(.secondary)
                            .padding(.horizontal)
                        ForEach(viewModel.namedPlayers) { player in
                            RosterPlayerRowView(player: player)
                                .padding(.horizontal)
                        }
                    }
                }
            }
            .padding(.bottom, 32)
        }
    }
}

// MARK: - Preview

#Preview("DailyRosterCompleteView") {
    DailyRosterCompleteView(viewModel: DailyRosterViewModel(date: "2026-04-17"))
}
