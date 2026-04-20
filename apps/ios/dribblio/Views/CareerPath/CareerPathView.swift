import SwiftUI

/// Root view for the Career Path game mode.
///
/// Owns the `CareerPathViewModel` and routes to the appropriate sub-view based
/// on `viewModel.phase`. Resetting the view model on play-again creates a fresh
/// session with a new socket connection.
struct CareerPathView: View {

    @State private var viewModel = CareerPathViewModel()

    var body: some View {
        NavigationStack {
            Group {
                switch viewModel.phase {
                case .config:
                    CareerPathConfigView(viewModel: viewModel)
                case .playing:
                    CareerPathPlayingView(viewModel: viewModel)
                case .gameOver:
                    CareerPathGameOverView(score: viewModel.score) {
                        viewModel = CareerPathViewModel()
                    }
                }
            }
            .navigationTitle("Career Path")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(.ultraThinMaterial, for: .navigationBar)
            .alert("Error", isPresented: .constant(viewModel.errorMessage != nil)) {
                Button("OK") { viewModel.dismissError() }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
        }
    }
}

// MARK: - Previews

#Preview("Career Path — Config") {
    CareerPathView()
}
