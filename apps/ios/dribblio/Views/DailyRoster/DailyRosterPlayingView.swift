import SwiftUI

/// The active gameplay screen for the Daily Roster challenge.
///
/// Lays out from top to bottom: the team/season header, progress bar,
/// a scrollable roster list mixing named rows and placeholders, and a sticky
/// input area at the bottom. Error states (no challenge, network error) replace
/// the roster list when present.
///
/// Guess outcome feedback ("Incorrect!", "Already named!") appears above the
/// search field and auto-clears after 2 seconds via `Task.sleep`.
struct DailyRosterPlayingView: View {
    let viewModel: DailyRosterViewModel

    @State private var lastGuessOutcome: GuessOutcome?

    var body: some View {
        VStack(spacing: 0) {
            if let challenge = viewModel.challenge {
                RosterHeaderView(
                    teamFullName: challenge.teamFullName,
                    teamAbbreviation: challenge.teamAbbreviation,
                    seasonId: challenge.seasonId
                )
                RosterProgressView(
                    namedCount: viewModel.namedPlayers.count,
                    rosterSize: challenge.rosterSize,
                    lives: viewModel.lives
                )
                .padding(.bottom, 8)
            }

            if let error = viewModel.error {
                errorView(error)
            } else {
                ScrollView {
                    LazyVStack(spacing: 6) {
                        ForEach(viewModel.namedPlayers) { player in
                            RosterPlayerRowView(player: player)
                        }
                        let remaining = (viewModel.challenge?.rosterSize ?? 0) - viewModel.namedPlayers.count
                        ForEach(0..<max(remaining, 0), id: \.self) { i in
                            RosterPlayerRowPlaceholder(index: i)
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                }

                // Sticky input area
                VStack(spacing: 8) {
                    if lastGuessOutcome == .wrong {
                        Text("Incorrect!")
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(.red)
                            .transition(.opacity)
                    } else if lastGuessOutcome == .duplicate {
                        Text("Already named!")
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(.orange)
                            .transition(.opacity)
                    }

                    PlayerSearchField(
                        placeholder: "Name a player…",
                        disabled: viewModel.complete,
                        onSelect: { player in
                            Task {
                                let outcome = await viewModel.submitGuess(player.playerId)
                                withAnimation { lastGuessOutcome = outcome }
                                if outcome != .correct {
                                    try? await Task.sleep(for: .seconds(2))
                                    withAnimation { lastGuessOutcome = nil }
                                } else {
                                    lastGuessOutcome = nil
                                }
                            }
                        }
                    )
                }
                .padding()
                .background(.ultraThinMaterial)
            }
        }
        .animation(.easeInOut(duration: 0.2), value: lastGuessOutcome != nil)
    }

    // MARK: - Error view

    @ViewBuilder
    private func errorView(_ error: DailyError) -> some View {
        VStack(spacing: 16) {
            Image(systemName: error == .noChallenge ? "calendar.badge.exclamationmark" : "wifi.slash")
                .font(.system(size: 48))
                .foregroundStyle(.secondary)
                .accessibilityHidden(true)
            Text(error == .noChallenge ? "No challenge today" : "Network error")
                .font(.headline)
            Text(error == .noChallenge
                 ? "Check back tomorrow!"
                 : "Check your connection and try again.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding()
        .frame(maxHeight: .infinity)
    }
}

// MARK: - Preview

#Preview("DailyRosterPlayingView") {
    DailyRosterPlayingView(viewModel: DailyRosterViewModel(date: "2026-04-17"))
}
