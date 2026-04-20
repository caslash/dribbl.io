import SwiftUI

/// Full-pool preview shown to all participants after the organizer saves config and
/// before the draft begins. Entries are not selectable here (`isMyTurn: false`).
/// The organizer sees a "Start Draft" button at the bottom.
struct PoolPreviewView: View {

    let viewModel: DraftViewModel

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 8) {
                ForEach(viewModel.pool) { entry in
                    PoolEntryRowView(
                        entry: entry,
                        available: true,
                        isMyTurn: false,
                        onSelect: {}
                    )
                }
            }
            .padding(.horizontal)
            .padding(.bottom, viewModel.isOrganizer ? 80 : 16)
        }
        .navigationTitle("Pool Preview")
        .navigationBarTitleDisplayMode(.inline)
        .overlay(alignment: .bottom) {
            if viewModel.isOrganizer {
                startDraftButton
            }
        }
    }

    private var startDraftButton: some View {
        Button(action: viewModel.startDraft) {
            Text("Start Draft")
                .fontWeight(.semibold)
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(.borderedProminent)
        .controlSize(.large)
        .padding(.horizontal)
        .padding(.bottom)
        .background(.ultraThinMaterial)
    }
}

// MARK: - Preview

#Preview("PoolPreviewView") {
    NavigationStack {
        PoolPreviewView(viewModel: DraftViewModel())
    }
}
