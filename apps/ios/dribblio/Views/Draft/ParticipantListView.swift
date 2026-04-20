import SwiftUI

/// A labeled list of participants in a draft room.
///
/// Each row shows the participant's name, a crown icon for the organizer, and
/// a "(you)" annotation for the local participant. Used inside `RoomInfoView`.
struct ParticipantListView: View {
    let participants: [Participant]
    let myParticipantId: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("PLAYERS (\(participants.count))")
                .font(.caption2.weight(.semibold))
                .foregroundStyle(.secondary)
            ForEach(participants) { participant in
                HStack {
                    Image(systemName: participant.isOrganizer ? "crown.fill" : "person.fill")
                        .foregroundStyle(participant.isOrganizer ? .yellow : .secondary)
                        .frame(width: 20)
                    Text(participant.name)
                        .font(.subheadline)
                    if participant.participantId == myParticipantId {
                        Text("(you)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    Spacer()
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .glassCard(cornerRadius: 8, interactive: false)
                .accessibilityLabel("\(participant.name)\(participant.isOrganizer ? ", organizer" : "")\(participant.participantId == myParticipantId ? ", you" : "")")
            }
        }
    }
}

// MARK: - Preview

#Preview("ParticipantListView") {
    ParticipantListView(
        participants: [
            Participant(participantId: "1", name: "Cameron", isOrganizer: true),
            Participant(participantId: "2", name: "Alex", isOrganizer: false),
            Participant(participantId: "3", name: "Jordan", isOrganizer: false),
        ],
        myParticipantId: "2"
    )
    .padding()
}
