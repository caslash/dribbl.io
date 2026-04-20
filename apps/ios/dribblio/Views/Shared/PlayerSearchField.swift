import SwiftUI

// MARK: - View

/// A debounced player search input with a dropdown results list.
///
/// Fires `APIClient.shared.searchPlayers(query:)` after 400 ms of keystroke
/// inactivity. Results appear in a scrollable overlay beneath the field and are
/// dismissed when the user selects an entry or clears the query.
///
/// - Example:
///   ```swift
///   PlayerSearchField(
///       placeholder: "Search NBA players…",
///       disabled: isGameOver
///   ) { player in
///       viewModel.submitGuess(player)
///   }
///   ```
struct PlayerSearchField: View {

    /// Placeholder text shown when the field is empty.
    var placeholder: String

    /// When `true`, the field and results list are non-interactive (e.g. during
    /// feedback animations or after game over).
    var disabled: Bool

    /// Called with the selected `PlayerSearchResult` when the user taps a result row.
    var onSelect: (PlayerSearchResult) -> Void

    // MARK: - State

    @State private var query = ""
    @State private var results: [PlayerSearchResult] = []
    @State private var isLoading = false

    /// Holds the current debounce task so prior work can be cancelled on each
    /// new keystroke without a Combine pipeline or Timer overhead.
    @State private var debounceTask: Task<Void, Never>?

    // MARK: - Body

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            searchInputRow
            if !results.isEmpty {
                resultsDropdown
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .animation(.easeInOut(duration: 0.15), value: results.isEmpty)
    }

    // MARK: - Subviews

    private var searchInputRow: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(.secondary)
                .accessibilityHidden(true)

            TextField(placeholder, text: $query)
                .disabled(disabled)
                .autocorrectionDisabled()
                .textInputAutocapitalization(.words)
                .onChange(of: query) { _, newValue in
                    scheduleSearch(query: newValue)
                }
                .accessibilityLabel("Player search")
                .accessibilityHint("Type a player name to search")

            if isLoading {
                ProgressView()
                    .scaleEffect(0.75)
                    .accessibilityLabel("Searching")
            }

            if !query.isEmpty {
                Button {
                    clearSearch()
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(.secondary)
                }
                .accessibilityLabel("Clear search")
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .glassCard(cornerRadius: 10, interactive: false)
    }

    private var resultsDropdown: some View {
        ScrollView {
            LazyVStack(alignment: .leading, spacing: 0) {
                ForEach(results) { player in
                    Button {
                        selectPlayer(player)
                    } label: {
                        HStack {
                            PlayerHeadshotView(
                                playerId: player.playerId,
                                playerName: player.fullName,
                                width: 32,
                                height: 32
                            )
                            Text(player.fullName)
                                .foregroundStyle(.primary)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                    }
                    .accessibilityLabel(player.fullName)

                    Divider()
                        .padding(.leading, 60)
                }
            }
        }
        .frame(maxHeight: 240)
        .glassCard(cornerRadius: 10, interactive: false)
    }

    // MARK: - Helpers

    private func selectPlayer(_ player: PlayerSearchResult) {
        query = player.fullName
        results = []
        onSelect(player)
    }

    private func clearSearch() {
        query = ""
        results = []
        isLoading = false
        debounceTask?.cancel()
        debounceTask = nil
    }

    private func scheduleSearch(query: String) {
        debounceTask?.cancel()

        guard query.count >= 2 else {
            results = []
            isLoading = false
            return
        }

        debounceTask = Task {
            try? await Task.sleep(for: .milliseconds(400))
            guard !Task.isCancelled else { return }

            await MainActor.run { isLoading = true }

            let hits = (try? await APIClient.shared.searchPlayers(query: query)) ?? []

            await MainActor.run {
                isLoading = false
                // Guard again: a rapid follow-up cancellation may have happened
                // between the sleep completing and this closure executing.
                if !Task.isCancelled {
                    results = hits
                }
            }
        }
    }
}

// MARK: - Previews

#Preview("PlayerSearchField") {
    ZStack {
        Color(.systemBackground).ignoresSafeArea()
        PlayerSearchField(
            placeholder: "Search NBA players…",
            disabled: false
        ) { player in
            print("Selected: \(player.fullName)")
        }
        .padding()
    }
}

#Preview("PlayerSearchField — Disabled") {
    ZStack {
        Color(.systemBackground).ignoresSafeArea()
        PlayerSearchField(
            placeholder: "Search NBA players…",
            disabled: true
        ) { _ in }
        .padding()
    }
}
