import SwiftUI

/// Player search field with Submit and Skip action buttons.
///
/// Uses `id(resetKey)` on `PlayerSearchField` to force a full remount after
/// each submission, clearing the search text and results without needing to
/// thread a clear callback down into that component.
struct GuessAreaView: View {

    let viewModel: CareerPathViewModel
    let disabled: Bool

    @State private var selectedPlayer: PlayerSearchResult? = nil
    @State private var resetKey: Int = 0

    var body: some View {
        VStack(spacing: 12) {
            PlayerSearchField(
                placeholder: "Search for a player…",
                disabled: disabled,
                onSelect: { player in
                    selectedPlayer = player
                }
            )
            .id(resetKey)

            HStack(spacing: 12) {
                Button {
                    guard let player = selectedPlayer else { return }
                    viewModel.submitGuess(player.playerId)
                    selectedPlayer = nil
                    resetKey += 1
                } label: {
                    Text("Submit Guess")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                }
                .buttonStyle(.borderedProminent)
                .tint(.accentColor)
                .disabled(disabled || selectedPlayer == nil)
                .accessibilityLabel("Submit guess")
                .accessibilityHint(selectedPlayer.map { "Submit \($0.fullName) as your answer" } ?? "Select a player first")

                Button {
                    viewModel.skip()
                    selectedPlayer = nil
                    resetKey += 1
                } label: {
                    Text("Skip")
                        .font(.headline)
                        .frame(maxWidth: 100)
                        .padding(.vertical, 14)
                }
                .buttonStyle(.bordered)
                .disabled(disabled)
                .accessibilityLabel("Skip this round")
            }
        }
    }
}

// MARK: - Previews

#Preview("GuessArea — Enabled") {
    GuessAreaView(viewModel: CareerPathViewModel(), disabled: false)
        .padding()
}

#Preview("GuessArea — Disabled") {
    GuessAreaView(viewModel: CareerPathViewModel(), disabled: true)
        .padding()
}
