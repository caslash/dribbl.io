import SwiftUI

/// Renders a row of heart icons representing remaining lives, with a spring
/// bounce animation on the icon at the boundary when a life is lost.
///
/// - Example:
///   ```swift
///   DailyLivesView(lives: 2, maxLives: 3)
///   ```
struct DailyLivesView: View {

    /// The number of remaining lives. Hearts beyond this count render as outlines.
    let lives: Int

    /// The total number of heart icons to display.
    let maxLives: Int

    // MARK: - State

    /// Tracks whether the boundary heart is mid-bounce animation.
    @State private var bouncing = false

    // MARK: - Body

    var body: some View {
        HStack(spacing: 6) {
            ForEach(0..<maxLives, id: \.self) { i in
                Image(systemName: i < lives ? "heart.fill" : "heart")
                    .foregroundStyle(i < lives ? Color.red : Color.secondary.opacity(0.4))
                    // Only the heart at the new boundary (index == lives after loss) bounces.
                    .scaleEffect(bouncing && i == lives ? 1.4 : 1.0)
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(lives) of \(maxLives) lives remaining")
        .onChange(of: lives) { _, _ in
            withAnimation(.spring(response: 0.3, dampingFraction: 0.4)) {
                bouncing = true
            }
            Task {
                try? await Task.sleep(for: .milliseconds(300))
                withAnimation { bouncing = false }
            }
        }
    }
}

// MARK: - Previews

#Preview("DailyLivesView — Full") {
    DailyLivesView(lives: 3, maxLives: 3)
        .padding()
}

#Preview("DailyLivesView — One left") {
    DailyLivesView(lives: 1, maxLives: 3)
        .padding()
}

#Preview("DailyLivesView — Dark") {
    DailyLivesView(lives: 2, maxLives: 3)
        .padding()
        .preferredColorScheme(.dark)
}
