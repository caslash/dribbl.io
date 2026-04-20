import SwiftUI

/// Bottom sheet confirming a draft pick before it is submitted to the server.
///
/// Displayed as a `.sheet` from `DraftBoardView` when the user taps a pool entry.
/// Presents the player headshot, name, subtitle, and stat pills (for MVP mode).
struct PickConfirmSheet: View {

    let entry: PoolEntry
    let onConfirm: () -> Void
    let onCancel: () -> Void

    var body: some View {
        VStack(spacing: 20) {
            Text("Confirm Pick")
                .font(.title2.weight(.bold)).fontDesign(.serif)

            PlayerHeadshotView(
                playerId: entry.playerId,
                playerName: entry.playerName,
                width: 80,
                height: 80
            )

            VStack(spacing: 4) {
                Text(entry.playerName)
                    .font(.headline)
                Text(entry.subtitle)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            if case .mvp(let e) = entry {
                HStack(spacing: 8) {
                    StatPillView(label: "PTS", value: e.ptsPg)
                    StatPillView(label: "AST", value: e.astPg)
                    StatPillView(label: "REB", value: e.rebPg)
                }
            }

            HStack(spacing: 12) {
                Button("Cancel", action: onCancel)
                    .buttonStyle(.bordered)
                    .frame(maxWidth: .infinity)

                Button("Draft \(entry.playerName.components(separatedBy: " ").last ?? "Player")", action: onConfirm)
                    .buttonStyle(.borderedProminent)
                    .frame(maxWidth: .infinity)
            }
        }
        .padding(24)
        .accessibilityElement(children: .contain)
    }
}

// MARK: - Preview

#Preview("PickConfirmSheet — MVP") {
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
    return PickConfirmSheet(entry: entry, onConfirm: {}, onCancel: {})
}

#Preview("PickConfirmSheet — Franchise") {
    let entry = PoolEntry.franchise(FranchisePoolEntry(
        entryId: "2",
        draftMode: "franchise",
        playerId: 893,
        playerName: "Magic Johnson",
        franchiseName: "Los Angeles Lakers",
        franchiseAbbr: "LAL"
    ))
    return PickConfirmSheet(entry: entry, onConfirm: {}, onCancel: {})
}
