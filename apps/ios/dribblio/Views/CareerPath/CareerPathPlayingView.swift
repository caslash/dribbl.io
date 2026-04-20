import SwiftUI

/// Main game screen. Composes the scoreboard, team history, and guess area.
///
/// An overlay with a scrim and `RoundFeedbackView` appears whenever
/// `viewModel.lastResult` is non-nil, blocking further interaction until dismissed.
struct CareerPathPlayingView: View {

    let viewModel: CareerPathViewModel

    var body: some View {
        ZStack {
            ScrollView {
                VStack(spacing: 20) {
                    ScoreBoardView(score: viewModel.score, lives: viewModel.lives)
                    TeamHistoryView(teamHistory: viewModel.teamHistory)
                    GuessAreaView(viewModel: viewModel, disabled: viewModel.lastResult != nil)
                }
                .padding()
            }

            if viewModel.lastResult != nil {
                Color.black.opacity(0.3)
                    .ignoresSafeArea()
                    .transition(.opacity)

                RoundFeedbackView(
                    result: viewModel.lastResult!,
                    validAnswers: viewModel.validAnswers,
                    lives: viewModel.lives,
                    onDismiss: { viewModel.clearFeedback() }
                )
                .transition(.scale.combined(with: .opacity))
            }
        }
        .animation(.easeInOut(duration: 0.2), value: viewModel.lastResult != nil)
    }
}

// MARK: - Previews

#Preview("Playing — No feedback") {
    CareerPathPlayingView(viewModel: {
        let vm = CareerPathViewModel()
        return vm
    }())
}
