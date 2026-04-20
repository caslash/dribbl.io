import SwiftUI

/// A compact card representing a single drafted player in the results screen.
///
/// Shows the pick number, player headshot, name, and subtitle (MVP season or franchise).
/// Used in both the "My Team" and "All Teams" results tabs.
struct MyPickCardView: View {
    let pickRecord: PickRecord
    let entry: PoolEntry?

    var body: some View {
        VStack(spacing: 8) {
            Text("#\(pickRecord.pickNumber)")
                .font(.caption2.weight(.bold))
                .foregroundStyle(.secondary)
            if let entry {
                PlayerHeadshotView(
                    playerId: entry.playerId,
                    playerName: entry.playerName,
                    width: 56,
                    height: 56
                )
                Text(entry.playerName)
                    .font(.caption.weight(.semibold))
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                Text(entry.subtitle)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
        }
        .padding(10)
        .glassCard(cornerRadius: 10, interactive: false)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Pick \(pickRecord.pickNumber): \(entry?.playerName ?? "unknown"), \(entry?.subtitle ?? "")")
    }
}

// MARK: - Preview

#Preview("MyPickCardView") {
    let pick = PickRecord(participantId: "1", entryId: "e1", round: 1, pickNumber: 3)
    let entry = PoolEntry.mvp(MvpPoolEntry(
        entryId: "e1",
        draftMode: "mvp",
        playerId: 2544,
        playerName: "LeBron James",
        season: "2011-12",
        ptsPg: 27.1,
        astPg: 6.2,
        rebPg: 7.9
    ))
    MyPickCardView(pickRecord: pick, entry: entry)
        .frame(width: 120)
        .padding()
}
