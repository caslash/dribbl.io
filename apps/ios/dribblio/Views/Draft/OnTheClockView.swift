import SwiftUI

/// Banner showing whose turn it is and, when it is the local user's turn, the countdown timer.
///
/// "YOUR TURN" label uses accent color to provide an immediate visual signal.
/// The `TurnTimerView` is only rendered when `isMyTurn` is `true` and a `turnDuration`
/// is configured, avoiding unnecessary timer state when not needed.
struct OnTheClockView: View {
    let participant: Participant?
    let isMyTurn: Bool
    let turnDuration: Int?
    let onTimerExpired: () -> Void

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(isMyTurn ? "YOUR TURN" : "ON THE CLOCK")
                    .font(.caption2.weight(.semibold))
                    .foregroundStyle(isMyTurn ? Color.accentColor : Color.secondary)
                Text(participant?.name ?? "…")
                    .font(.headline.weight(.bold))
            }
            Spacer()
            if let duration = turnDuration, isMyTurn {
                TurnTimerView(durationSeconds: duration, onExpire: onTimerExpired)
            }
        }
        .padding()
        .glassCard(interactive: false)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(isMyTurn ? "Your turn" : "On the clock: \(participant?.name ?? "unknown")")
    }
}

// MARK: - Previews

#Preview("OnTheClockView — My Turn") {
    OnTheClockView(
        participant: Participant(participantId: "1", name: "Cameron", isOrganizer: true),
        isMyTurn: true,
        turnDuration: 30,
        onTimerExpired: {}
    )
    .padding()
}

#Preview("OnTheClockView — Waiting") {
    OnTheClockView(
        participant: Participant(participantId: "2", name: "Alex", isOrganizer: false),
        isMyTurn: false,
        turnDuration: 30,
        onTimerExpired: {}
    )
    .padding()
}
