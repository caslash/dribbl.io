import SwiftUI

/// Compact progress header showing how many roster players have been named and lives remaining.
///
/// Lives are delegated to `DailyLivesView`. The `ProgressView` uses `.tint(.accentColor)`
/// rather than a fixed color so it respects the app's accent in both light and dark mode.
struct RosterProgressView: View {
    let namedCount: Int
    let rosterSize: Int
    let lives: Int
    var maxLives: Int = 3

    private var progress: Double {
        guard rosterSize > 0 else { return 0 }
        return Double(namedCount) / Double(rosterSize)
    }

    var body: some View {
        VStack(spacing: 8) {
            HStack {
                Text("\(namedCount) / \(rosterSize)")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
                Spacer()
                DailyLivesView(lives: lives, maxLives: maxLives)
            }
            ProgressView(value: progress)
                .tint(.accentColor)
        }
        .padding(.horizontal)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(namedCount) of \(rosterSize) players named, \(lives) lives remaining")
    }
}

// MARK: - Preview

#Preview("RosterProgressView") {
    VStack(spacing: 24) {
        RosterProgressView(namedCount: 5, rosterSize: 12, lives: 3)
        RosterProgressView(namedCount: 10, rosterSize: 12, lives: 1)
        RosterProgressView(namedCount: 12, rosterSize: 12, lives: 2)
    }
    .padding()
}
