import SwiftUI

/// Sheet presenting the room code and full participant list.
///
/// Displayed from `DraftLobbyView`'s toolbar button throughout the session so
/// participants can share the code or check who's in the room at any phase.
struct RoomInfoView: View {
    let participants: [Participant]
    let roomId: String?
    let myParticipantId: String?

    var body: some View {
        VStack(spacing: 20) {
            if let roomId {
                VStack(spacing: 4) {
                    Text("ROOM CODE")
                        .font(.caption2.weight(.semibold))
                        .foregroundStyle(.secondary)
                    Text(roomId.uppercased())
                        .font(.system(.largeTitle, design: .monospaced).weight(.bold))
                        .accessibilityLabel("Room code: \(roomId.uppercased())")
                }
                .padding()
                .glassCard(interactive: false)
            }
            ParticipantListView(participants: participants, myParticipantId: myParticipantId)
            Spacer()
        }
        .padding()
    }
}

// MARK: - Preview

#Preview("RoomInfoView") {
    RoomInfoView(
        participants: [
            Participant(participantId: "1", name: "Cameron", isOrganizer: true),
            Participant(participantId: "2", name: "Alex", isOrganizer: false),
        ],
        roomId: "XYZ12",
        myParticipantId: "1"
    )
}
