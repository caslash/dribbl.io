import SwiftUI

// MARK: - Tab Enum

private enum ResultsTab: String, CaseIterable {
    case myTeam = "My Team"
    case allTeams = "All Teams"
    case draftOrder = "Draft Order"
}

// MARK: - DraftResultsView

/// Post-draft results screen with three tabs: the local user's team, all teams, and full pick order.
///
/// A segmented `Picker` drives tab selection (HIG: segmented controls for 2–5 mutually exclusive
/// content sections of comparable importance). The "Start New Draft" button calls `onLeave` which
/// triggers `viewModel.leave()` and resets state back to `.entrance`.
struct DraftResultsView: View {
    let viewModel: DraftViewModel
    let onLeave: () -> Void

    @State private var activeTab: ResultsTab = .myTeam

    var body: some View {
        VStack(spacing: 0) {
            Picker("Results", selection: $activeTab) {
                ForEach(ResultsTab.allCases, id: \.self) { tab in
                    Text(tab.rawValue).tag(tab)
                }
            }
            .pickerStyle(.segmented)
            .padding()

            ScrollView {
                switch activeTab {
                case .myTeam:
                    MyTeamResultsView(viewModel: viewModel)
                case .allTeams:
                    AllTeamsResultsView(viewModel: viewModel)
                case .draftOrder:
                    DraftOrderResultsView(
                        pickHistory: viewModel.pickHistory,
                        participants: viewModel.participants,
                        pool: viewModel.pool
                    )
                }
            }

            Button("Start New Draft", action: onLeave)
                .buttonStyle(.borderedProminent)
                .padding()
        }
        .navigationTitle("Results")
    }
}

// MARK: - My Team Tab

private struct MyTeamResultsView: View {
    let viewModel: DraftViewModel

    private var myPicks: [PickRecord] {
        viewModel.pickHistory.filter { $0.participantId == viewModel.myParticipantId }
    }

    var body: some View {
        if myPicks.isEmpty {
            Text("No picks recorded.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding()
        } else {
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 120))], spacing: 12) {
                ForEach(myPicks) { pick in
                    let entry = viewModel.pool.first { $0.entryId == pick.entryId }
                    MyPickCardView(pickRecord: pick, entry: entry)
                }
            }
            .padding()
        }
    }
}

// MARK: - All Teams Tab

private struct AllTeamsResultsView: View {
    let viewModel: DraftViewModel

    var body: some View {
        VStack(spacing: 20) {
            ForEach(viewModel.participants) { participant in
                let picks = viewModel.pickHistory.filter { $0.participantId == participant.participantId }
                VStack(alignment: .leading, spacing: 8) {
                    Text(participant.name)
                        .font(.headline.weight(.bold))
                        .padding(.horizontal)
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 100))], spacing: 8) {
                        ForEach(picks) { pick in
                            let entry = viewModel.pool.first { $0.entryId == pick.entryId }
                            MyPickCardView(pickRecord: pick, entry: entry)
                        }
                    }
                    .padding(.horizontal)
                }
            }
        }
        .padding(.vertical)
    }
}

// MARK: - Draft Order Tab

private struct DraftOrderResultsView: View {
    let pickHistory: [PickRecord]
    let participants: [Participant]
    let pool: [PoolEntry]

    var body: some View {
        LazyVStack(spacing: 8) {
            ForEach(pickHistory) { pick in
                let participantName = participants.first(where: { $0.participantId == pick.participantId })?.name ?? "?"
                let entry = pool.first { $0.entryId == pick.entryId }
                HStack {
                    Text("#\(pick.pickNumber)")
                        .font(.caption.weight(.bold))
                        .foregroundStyle(.secondary)
                        .frame(width: 32, alignment: .trailing)
                    if let entry {
                        PlayerHeadshotView(
                            playerId: entry.playerId,
                            playerName: entry.playerName,
                            width: 36,
                            height: 36
                        )
                        VStack(alignment: .leading, spacing: 1) {
                            Text(entry.playerName)
                                .font(.subheadline.weight(.semibold))
                            Text(participantName)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    Spacer()
                    Text("Rd \(pick.round)")
                        .font(.caption2)
                        .foregroundStyle(.tertiary)
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .glassCard(cornerRadius: 8, interactive: false)
            }
        }
        .padding()
    }
}

// MARK: - Preview

#Preview("DraftResultsView") {
    NavigationStack {
        DraftResultsView(viewModel: DraftViewModel(), onLeave: {})
    }
}
