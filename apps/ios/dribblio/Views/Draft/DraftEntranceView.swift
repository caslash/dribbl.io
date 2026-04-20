import SwiftUI

/// Landing screen for the draft game mode.
///
/// Presents two glass cards side-by-side (or stacked on smaller screens):
/// one for creating a new room and one for joining an existing room by code.
struct DraftEntranceView: View {

    let viewModel: DraftViewModel

    // MARK: - State

    @State private var createName = ""
    @State private var joinName = ""
    @State private var joinCode = ""
    @State private var isCreating = false

    // MARK: - Body

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                header
                createCard
                joinCard
            }
            .padding()
        }
        .navigationTitle("NBA Draft")
        .navigationBarTitleDisplayMode(.large)
        .disabled(isCreating)
    }

    // MARK: - Subviews

    private var header: some View {
        VStack(spacing: 6) {
            Text("NBA All-Time Draft")
                .font(.largeTitle.weight(.bold)).fontDesign(.serif)
            Text("Build your dream all-time roster")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .multilineTextAlignment(.center)
        .padding(.top, 8)
    }

    private var createCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            Label("Create Room", systemImage: "plus.circle.fill")
                .font(.headline)

            TextField("Your name", text: $createName)
                .textContentType(.name)
                .submitLabel(.go)
                .onSubmit { triggerCreate() }

            Button(action: triggerCreate) {
                HStack {
                    if isCreating {
                        ProgressView()
                            .controlSize(.small)
                            .padding(.trailing, 4)
                    }
                    Text(isCreating ? "Creating…" : "Create")
                        .fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .disabled(createName.trimmingCharacters(in: .whitespaces).isEmpty || isCreating)
        }
        .padding()
        .glassCard(interactive: false)
    }

    private var joinCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            Label("Join Room", systemImage: "person.badge.plus")
                .font(.headline)

            TextField("Your name", text: $joinName)
                .textContentType(.name)
                .submitLabel(.next)

            TextField("Room code", text: $joinCode)
                .textInputAutocapitalization(.characters)
                .autocorrectionDisabled()
                .submitLabel(.go)
                .onSubmit { triggerJoin() }
                // Display in monospaced uppercase to match the room code style in RoomInfoView.
                .font(.system(.body, design: .monospaced))

            Button("Join", action: triggerJoin)
                .buttonStyle(.borderedProminent)
                .fontWeight(.semibold)
                .frame(maxWidth: .infinity)
                .disabled(
                    joinName.trimmingCharacters(in: .whitespaces).isEmpty ||
                    joinCode.trimmingCharacters(in: .whitespaces).isEmpty
                )
        }
        .padding()
        .glassCard(interactive: false)
    }

    // MARK: - Actions

    private func triggerCreate() {
        let name = createName.trimmingCharacters(in: .whitespaces)
        guard !name.isEmpty, !isCreating else { return }
        isCreating = true
        Task {
            await viewModel.createRoom(name: name)
            isCreating = false
        }
    }

    private func triggerJoin() {
        let name = joinName.trimmingCharacters(in: .whitespaces)
        let code = joinCode.trimmingCharacters(in: .whitespaces)
        guard !name.isEmpty, !code.isEmpty else { return }
        viewModel.joinRoom(roomId: code.uppercased(), name: name)
    }
}

// MARK: - Preview

#Preview("DraftEntranceView") {
    NavigationStack {
        DraftEntranceView(viewModel: DraftViewModel())
    }
}

#Preview("DraftEntranceView — Dark") {
    NavigationStack {
        DraftEntranceView(viewModel: DraftViewModel())
    }
    .preferredColorScheme(.dark)
}
