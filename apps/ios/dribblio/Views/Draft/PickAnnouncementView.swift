import SwiftUI

/// Full-screen overlay that briefly announces a confirmed pick to all participants.
///
/// Auto-dismissed by `DraftBoardView` after 2.5 seconds via `Task.sleep`. The
/// `.transition(.scale.combined(with: .opacity))` applied at the call site means
/// this view does not need its own entry/exit modifiers.
struct PickAnnouncementView: View {
    let participant: Participant
    let entry: PoolEntry

    var body: some View {
        VStack(spacing: 12) {
            Text(participant.name)
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
            Text("drafted")
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(entry.playerName)
                .font(.title2.weight(.bold))
                .fontDesign(.serif)
            Text(entry.subtitle)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding(24)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 20))
        .padding()
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(participant.name) drafted \(entry.playerName), \(entry.subtitle)")
    }
}

// MARK: - Preview

#Preview("PickAnnouncementView") {
    ZStack {
        Color(.systemGroupedBackground).ignoresSafeArea()
        PickAnnouncementView(
            participant: Participant(participantId: "1", name: "Cameron", isOrganizer: true),
            entry: .mvp(MvpPoolEntry(
                entryId: "1",
                draftMode: "mvp",
                playerId: 2544,
                playerName: "LeBron James",
                season: "2011-12",
                ptsPg: 27.1,
                astPg: 6.2,
                rebPg: 7.9
            ))
        )
    }
}
