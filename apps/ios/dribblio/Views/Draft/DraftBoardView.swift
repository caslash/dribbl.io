import SwiftUI

/// Main drafting screen shown during the `.drafting` phase.
///
/// Composed of four areas stacked vertically:
/// 1. `DraftTimelineView` — running horizontal pick history strip.
/// 2. `OnTheClockView` — whose turn it is, with optional countdown timer.
/// 3. A filter `TextField` to narrow the pool by player name.
/// 4. A `LazyVStack` of `PoolEntryRowView` items, tappable only on the local user's turn.
///
/// Pick confirmation is a `.sheet(item:)` presenting `PickConfirmSheet`. A
/// `PickAnnouncementView` overlays the screen briefly after each confirmed pick.
struct DraftBoardView: View {
    let viewModel: DraftViewModel

    @State private var filter = ""
    @State private var selectedEntry: PoolEntry?
    @State private var announcedPick: PickRecord?
    @State private var previousPickCount = 0

    // MARK: - Computed

    private var availablePool: [PoolEntry] {
        viewModel.pool.filter { !viewModel.invalidatedEntryIds.contains($0.entryId) }
    }

    private var filteredPool: [PoolEntry] {
        guard !filter.isEmpty else { return availablePool }
        return availablePool.filter { $0.playerName.localizedCaseInsensitiveContains(filter) }
    }

    // MARK: - Body

    var body: some View {
        VStack(spacing: 0) {
            DraftTimelineView(pickHistory: viewModel.pickHistory, participants: viewModel.participants)

            OnTheClockView(
                participant: viewModel.currentTurnParticipant,
                isMyTurn: viewModel.isMyTurn,
                turnDuration: viewModel.config?.turnDuration,
                onTimerExpired: { viewModel.notifyTimerExpired() }
            )
            .padding(.horizontal)
            .padding(.vertical, 8)

            TextField("Search pool…", text: $filter)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 10))
                .padding(.horizontal)
                .padding(.bottom, 8)

            ScrollView {
                LazyVStack(spacing: 8) {
                    ForEach(filteredPool) { entry in
                        PoolEntryRowView(
                            entry: entry,
                            available: true,
                            isMyTurn: viewModel.isMyTurn
                        ) {
                            selectedEntry = entry
                        }
                    }
                }
                .padding(.horizontal)
                .padding(.bottom, 16)
            }
        }
        // MARK: - Pick confirm sheet
        .sheet(item: $selectedEntry) { entry in
            PickConfirmSheet(
                entry: entry,
                onConfirm: {
                    viewModel.submitPick(entryId: entry.entryId)
                    selectedEntry = nil
                },
                onCancel: { selectedEntry = nil }
            )
            .presentationDetents([.medium])
            .presentationBackground(.ultraThinMaterial)
        }
        // MARK: - Pick announcement overlay
        .onChange(of: viewModel.pickHistory.count) { _, newCount in
            if newCount > previousPickCount, let latest = viewModel.pickHistory.last {
                previousPickCount = newCount
                announcedPick = latest
                Task {
                    try? await Task.sleep(for: .milliseconds(2500))
                    announcedPick = nil
                }
            }
        }
        .overlay {
            if let pick = announcedPick,
               let participant = viewModel.participants.first(where: { $0.participantId == pick.participantId }),
               let entry = viewModel.pool.first(where: { $0.entryId == pick.entryId }) {
                PickAnnouncementView(participant: participant, entry: entry)
                    .transition(.scale.combined(with: .opacity))
            }
        }
        .animation(.easeInOut(duration: 0.3), value: announcedPick?.id)
    }
}

// MARK: - Preview

#Preview("DraftBoardView") {
    NavigationStack {
        DraftBoardView(viewModel: DraftViewModel())
            .navigationTitle("Draft Room")
            .navigationBarTitleDisplayMode(.inline)
    }
}
