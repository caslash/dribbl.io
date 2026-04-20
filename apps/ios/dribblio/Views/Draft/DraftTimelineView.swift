import SwiftUI

/// A horizontally scrolling strip showing the pick history for the current draft.
///
/// Each pill displays the pick number and the name of the participant who made it.
/// Most useful during the drafting phase as a running record of all confirmed picks.
struct DraftTimelineView: View {
    let pickHistory: [PickRecord]
    let participants: [Participant]

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(pickHistory) { pick in
                    let name = participants.first(where: { $0.participantId == pick.participantId })?.name ?? "?"
                    VStack(spacing: 2) {
                        Text("#\(pick.pickNumber)")
                            .font(.caption2.weight(.bold))
                            .foregroundStyle(.secondary)
                        Text(name)
                            .font(.caption2)
                            .lineLimit(1)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .glassCard(cornerRadius: 8, interactive: false)
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 8)
        }
        .frame(height: 56)
    }
}

// MARK: - Preview

#Preview("DraftTimelineView") {
    let picks = [
        PickRecord(participantId: "1", entryId: "e1", round: 1, pickNumber: 1),
        PickRecord(participantId: "2", entryId: "e2", round: 1, pickNumber: 2),
        PickRecord(participantId: "1", entryId: "e3", round: 2, pickNumber: 3),
    ]
    let participants = [
        Participant(participantId: "1", name: "Cameron", isOrganizer: true),
        Participant(participantId: "2", name: "Alex", isOrganizer: false),
    ]
    DraftTimelineView(pickHistory: picks, participants: participants)
        .padding()
}
