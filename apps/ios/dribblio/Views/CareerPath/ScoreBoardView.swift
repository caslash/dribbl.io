import SwiftUI

/// Displays the current score and remaining lives in a glass card.
///
/// Renders heart icons for finite lives and an infinity symbol for infinite mode.
struct ScoreBoardView: View {

    let score: Int
    /// `nil` means infinite lives mode.
    let lives: Int?

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("SCORE")
                    .font(.caption2.weight(.semibold))
                    .foregroundStyle(.secondary)
                Text("\(score)")
                    .font(.title.weight(.bold)).fontDesign(.serif)
            }
            .accessibilityElement(children: .combine)
            .accessibilityLabel("Score: \(score)")

            Spacer()

            VStack(alignment: .trailing, spacing: 2) {
                Text("LIVES")
                    .font(.caption2.weight(.semibold))
                    .foregroundStyle(.secondary)
                if let lives {
                    HStack(spacing: 4) {
                        ForEach(0..<max(lives, 0), id: \.self) { _ in
                            Image(systemName: "heart.fill")
                                .foregroundStyle(.red)
                        }
                    }
                    .accessibilityLabel(lives == 1 ? "1 life remaining" : "\(lives) lives remaining")
                } else {
                    Text("∞")
                        .font(.title2.weight(.bold))
                        .accessibilityLabel("Infinite lives")
                }
            }
        }
        .padding()
        .glassCard(interactive: false)
    }
}

// MARK: - Previews

#Preview("ScoreBoard — Finite lives") {
    ScoreBoardView(score: 7, lives: 3)
        .padding()
}

#Preview("ScoreBoard — Infinite") {
    ScoreBoardView(score: 12, lives: nil)
        .padding()
}

#Preview("ScoreBoard — Dark") {
    ScoreBoardView(score: 4, lives: 1)
        .padding()
        .preferredColorScheme(.dark)
}
