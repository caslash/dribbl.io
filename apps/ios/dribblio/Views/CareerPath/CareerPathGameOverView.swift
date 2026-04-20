import SwiftUI

/// Game over screen displayed when the player has exhausted all lives.
///
/// Shows the final score and provides a "Play Again" action to start a fresh session.
struct CareerPathGameOverView: View {

    let score: Int
    let onPlayAgain: () -> Void

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            Image(systemName: "basketball.fill")
                .font(.system(size: 72))
                .foregroundStyle(.secondary)
                .accessibilityHidden(true)

            VStack(spacing: 12) {
                Text("Game Over")
                    .font(.largeTitle.weight(.bold))
                    .fontDesign(.serif)

                Text("You've run out of lives.")
                    .font(.body)
                    .foregroundStyle(.secondary)

                Text("Final Score: \(score)")
                    .font(.title2.weight(.semibold))
            }

            Button("Play Again") {
                onPlayAgain()
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .accessibilityLabel("Play Career Path again")

            Spacer()
        }
        .padding()
    }
}

// MARK: - Previews

#Preview("Game Over") {
    CareerPathGameOverView(score: 14, onPlayAgain: {})
}

#Preview("Game Over — Dark") {
    CareerPathGameOverView(score: 3, onPlayAgain: {})
        .preferredColorScheme(.dark)
}
