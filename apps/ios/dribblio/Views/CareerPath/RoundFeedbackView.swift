import SwiftUI

/// Overlay card showing correct / incorrect / skip feedback for a completed round.
///
/// Auto-dismisses after 3 seconds via a `.task` modifier. The user can also
/// tap "Continue" to dismiss early. Valid answers are shown only on a correct guess.
struct RoundFeedbackView: View {

    let result: GuessResult
    let validAnswers: [PlayerResult]
    /// `nil` means infinite lives mode — remaining-lives label is hidden.
    let lives: Int?
    let onDismiss: () -> Void

    // MARK: - Derived properties

    private var title: String {
        switch result {
        case .correct: "Correct!"
        case .incorrect: "Incorrect"
        case .skip: "Skipped"
        }
    }

    private var color: Color {
        switch result {
        case .correct: .green
        case .incorrect: .red
        case .skip: .orange
        }
    }

    private var icon: String {
        switch result {
        case .correct: "checkmark.circle.fill"
        case .incorrect: "xmark.circle.fill"
        case .skip: "forward.fill"
        }
    }

    // MARK: - Body

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 48))
                .foregroundStyle(color)
                .accessibilityHidden(true)

            Text(title)
                .font(.title.weight(.bold)).fontDesign(.serif)

            if result == .correct && !validAnswers.isEmpty {
                validAnswersSection
            }

            if result == .incorrect, let lives {
                Text(lives == 1 ? "1 life remaining" : "\(lives) lives remaining")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Button("Continue", action: onDismiss)
                .buttonStyle(.borderedProminent)
                .tint(color)
        }
        .padding(24)
        .frame(maxWidth: 340)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 20))
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(color.opacity(0.3), lineWidth: 1)
        )
        .accessibilityElement(children: .contain)
        .task {
            // Auto-dismiss after 3 seconds — the user can still tap Continue early.
            try? await Task.sleep(for: .seconds(3))
            onDismiss()
        }
    }

    // MARK: - Subviews

    private var validAnswersSection: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Valid answers:")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
            ForEach(validAnswers, id: \.playerId) { player in
                Text(player.fullName)
                    .font(.subheadline)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

// MARK: - Previews

#Preview("Feedback — Correct") {
    ZStack {
        Color.black.opacity(0.4).ignoresSafeArea()
        RoundFeedbackView(
            result: .correct,
            validAnswers: [
                PlayerResult(playerId: 1, fullName: "LeBron James", firstName: "LeBron", lastName: "James"),
                PlayerResult(playerId: 2, fullName: "Anthony Davis", firstName: "Anthony", lastName: "Davis"),
            ],
            lives: 3,
            onDismiss: {}
        )
    }
}

#Preview("Feedback — Incorrect") {
    ZStack {
        Color.black.opacity(0.4).ignoresSafeArea()
        RoundFeedbackView(
            result: .incorrect,
            validAnswers: [],
            lives: 2,
            onDismiss: {}
        )
    }
}

#Preview("Feedback — Skip (infinite)") {
    ZStack {
        Color.black.opacity(0.4).ignoresSafeArea()
        RoundFeedbackView(
            result: .skip,
            validAnswers: [],
            lives: nil,
            onDismiss: {}
        )
    }
}

#Preview("Feedback — Dark") {
    ZStack {
        Color.black.opacity(0.6).ignoresSafeArea()
        RoundFeedbackView(
            result: .correct,
            validAnswers: [
                PlayerResult(playerId: 3, fullName: "Kobe Bryant", firstName: "Kobe", lastName: "Bryant")
            ],
            lives: 5,
            onDismiss: {}
        )
    }
    .preferredColorScheme(.dark)
}
