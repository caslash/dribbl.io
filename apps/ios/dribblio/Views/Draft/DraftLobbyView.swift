import SwiftUI

/// Main hub for the draft room. Switches content based on `viewModel.phase` while
/// the navigation stack stays at this level for the entire room session.
///
/// On iPhone, the room info panel is presented as a `.sheet` via the toolbar button
/// rather than being shown inline, keeping the primary content uncluttered.
struct DraftLobbyView: View {

    let viewModel: DraftViewModel
    @Binding var path: NavigationPath
    @State private var showRoomInfo = false

    // MARK: - Body

    var body: some View {
        Group {
            switch viewModel.phase {
            case .lobby, .configuring:
                if viewModel.isOrganizer {
                    DraftConfigView(viewModel: viewModel)
                } else {
                    WaitingForOrganizerView(participants: viewModel.participants)
                }
            case .poolPreview:
                PoolPreviewView(viewModel: viewModel)
            case .drafting:
                DraftBoardView(viewModel: viewModel)
            case .results:
                DraftResultsView(viewModel: viewModel, onLeave: { viewModel.leave() })
            default:
                EmptyView()
            }
        }
        .navigationTitle(viewModel.roomId.map { "Room \($0)" } ?? "Draft Room")
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(.ultraThinMaterial, for: .navigationBar)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    showRoomInfo = true
                } label: {
                    Image(systemName: "person.2.fill")
                }
                .accessibilityLabel("Room info")
            }
            ToolbarItem(placement: .topBarLeading) {
                Button("Leave", role: .destructive) {
                    viewModel.leave()
                }
            }
        }
        .navigationBarBackButtonHidden(true)
        .sheet(isPresented: $showRoomInfo) {
            RoomInfoView(
                participants: viewModel.participants,
                roomId: viewModel.roomId,
                myParticipantId: viewModel.myParticipantId
            )
            .presentationDetents([.medium])
            .presentationBackground(.ultraThinMaterial)
        }
    }
}

// MARK: - WaitingForOrganizerView

/// Shown to non-organizer participants while the organizer is configuring the draft.
struct WaitingForOrganizerView: View {

    let participants: [Participant]

    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.2)
            Text("Waiting for the organizer to configure the draft…")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
            Text("\(participants.count) player\(participants.count == 1 ? "" : "s") in room")
                .font(.caption)
                .foregroundStyle(.tertiary)
        }
        .padding()
    }
}

// MARK: - Previews

#Preview("WaitingForOrganizerView") {
    WaitingForOrganizerView(participants: [
        Participant(participantId: "1", name: "Cameron", isOrganizer: true),
        Participant(participantId: "2", name: "Alex", isOrganizer: false)
    ])
}
