import SwiftUI

/// A single row in the draft pool list.
///
/// Tappable only when both `available` and `isMyTurn` are true.
/// Displays stat pills for MVP entries; franchise entries show just the franchise name.
struct PoolEntryRowView: View {

    let entry: PoolEntry
    let available: Bool
    let isMyTurn: Bool
    let onSelect: () -> Void

    var body: some View {
        Button(action: onSelect) {
            HStack(spacing: 12) {
                PlayerHeadshotView(
                    playerId: entry.playerId,
                    playerName: entry.playerName,
                    width: 44,
                    height: 44
                )

                VStack(alignment: .leading, spacing: 2) {
                    Text(entry.playerName)
                        .font(.headline)
                        .foregroundStyle(available ? .primary : .secondary)
                    Text(entry.subtitle)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Spacer()

                if case .mvp(let e) = entry {
                    HStack(spacing: 4) {
                        StatPillView(label: "PTS", value: e.ptsPg)
                        StatPillView(label: "AST", value: e.astPg)
                        StatPillView(label: "REB", value: e.rebPg)
                    }
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .glassCard(cornerRadius: 10, interactive: available && isMyTurn)
            .opacity(available ? 1.0 : 0.4)
        }
        .disabled(!available || !isMyTurn)
        .accessibilityLabel("\(entry.playerName), \(entry.subtitle)")
        .accessibilityHint(available && isMyTurn ? "Double tap to select this player" : "")
    }
}

// MARK: - Previews

#Preview("PoolEntryRowView — MVP, selectable") {
    let entry = PoolEntry.mvp(MvpPoolEntry(
        entryId: "1",
        draftMode: "mvp",
        playerId: 2544,
        playerName: "LeBron James",
        season: "2011-12",
        ptsPg: 27.1,
        astPg: 6.2,
        rebPg: 7.9
    ))
    return PoolEntryRowView(entry: entry, available: true, isMyTurn: true, onSelect: {})
        .padding()
}

#Preview("PoolEntryRowView — Franchise, not my turn") {
    let entry = PoolEntry.franchise(FranchisePoolEntry(
        entryId: "2",
        draftMode: "franchise",
        playerId: 893,
        playerName: "Magic Johnson",
        franchiseName: "Los Angeles Lakers",
        franchiseAbbr: "LAL"
    ))
    return PoolEntryRowView(entry: entry, available: true, isMyTurn: false, onSelect: {})
        .padding()
}
