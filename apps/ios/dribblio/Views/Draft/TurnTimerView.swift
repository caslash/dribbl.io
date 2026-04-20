import SwiftUI

/// Circular countdown timer displayed during the active participant's turn.
///
/// Uses a `Timer`-based approach (1 Hz tick) rather than `TimelineView` to avoid
/// the continuous re-render overhead of the latter when only whole-second accuracy
/// is needed. The ring animates linearly between ticks for a smooth sweep effect.
///
/// Turns urgent (red) at ≤ 5 seconds remaining, with a `symbolEffect(.pulse)` on
/// the countdown label to draw attention (iOS 17+).
struct TurnTimerView: View {

    let durationSeconds: Int
    let onExpire: () -> Void

    @State private var secondsRemaining: Int
    @State private var timer: Timer? = nil

    init(durationSeconds: Int, onExpire: @escaping () -> Void) {
        self.durationSeconds = durationSeconds
        self.onExpire = onExpire
        self._secondsRemaining = State(initialValue: durationSeconds)
    }

    // MARK: - Computed

    private var progress: Double {
        Double(secondsRemaining) / Double(max(durationSeconds, 1))
    }

    private var isUrgent: Bool { secondsRemaining <= 5 }

    // MARK: - Body

    var body: some View {
        ZStack {
            Circle()
                .stroke(Color.secondary.opacity(0.2), lineWidth: 4)

            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    isUrgent ? Color.red : Color.accentColor,
                    style: StrokeStyle(lineWidth: 4, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .animation(.linear(duration: 1), value: progress)

            Text("\(secondsRemaining)")
                .font(.system(.caption, design: .monospaced).weight(.bold))
                .foregroundStyle(isUrgent ? .red : .primary)
                .contentTransition(.numericText())
                .symbolEffect(.pulse, isActive: isUrgent)
        }
        .frame(width: 44, height: 44)
        .accessibilityLabel("\(secondsRemaining) seconds remaining")
        .onAppear { startTimer() }
        .onDisappear { timer?.invalidate() }
    }

    // MARK: - Timer

    private func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            if secondsRemaining > 0 {
                secondsRemaining -= 1
            } else {
                timer?.invalidate()
                onExpire()
            }
        }
    }
}

// MARK: - Preview

#Preview("TurnTimerView — Normal") {
    TurnTimerView(durationSeconds: 60, onExpire: {})
        .padding()
}

#Preview("TurnTimerView — Urgent") {
    TurnTimerView(durationSeconds: 3, onExpire: {})
        .padding()
}
