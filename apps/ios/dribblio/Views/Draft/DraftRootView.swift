import SwiftUI

/// Navigation destinations reachable from the draft entrance.
enum DraftNavDestination: Hashable {
    case lobby
}

/// Root view for the NBA All-Time Draft game mode.
///
/// Owns the `DraftViewModel` and a `NavigationPath` so it can drive programmatic
/// navigation in response to phase changes. The view model is reset to a fresh
/// instance whenever the user returns to the entrance phase.
struct DraftRootView: View {

    @State private var viewModel = DraftViewModel()
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            DraftEntranceView(viewModel: viewModel)
                .navigationDestination(for: DraftNavDestination.self) { dest in
                    switch dest {
                    case .lobby:
                        DraftLobbyView(viewModel: viewModel, path: $path)
                    }
                }
        }
        .onChange(of: viewModel.phase) { _, newPhase in
            switch newPhase {
            case .lobby where path.isEmpty:
                path.append(DraftNavDestination.lobby)
            case .entrance:
                path = NavigationPath()
                viewModel = DraftViewModel()
            default:
                break
            }
        }
        .alert("Error", isPresented: .constant(viewModel.errorMessage != nil)) {
            Button("OK") { viewModel.errorMessage = nil }
        } message: {
            Text(viewModel.errorMessage ?? "")
        }
    }
}

// MARK: - Preview

#Preview("DraftRootView") {
    DraftRootView()
}
