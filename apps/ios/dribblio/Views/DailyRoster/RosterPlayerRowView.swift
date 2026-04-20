import SwiftUI

/// A row displaying a named player in the Daily Roster game.
///
/// The `missed` flag is used in the complete screen to visually indicate players
/// the user failed to guess — shown with a strikethrough, reduced opacity, and a
/// red border, while remaining legible for the player's stats.
struct RosterPlayerRowView: View {
    let player: NamedPlayer
    var missed: Bool = false

    var body: some View {
        HStack(spacing: 12) {
            if let jersey = player.jerseyNumber {
                Text("#\(jersey)")
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.secondary)
                    .frame(width: 32, alignment: .trailing)
            } else {
                Spacer().frame(width: 32)
            }

            PlayerHeadshotView(
                playerId: player.playerId,
                playerName: player.fullName,
                width: 40,
                height: 40
            )

            VStack(alignment: .leading, spacing: 2) {
                Text(player.fullName)
                    .font(.subheadline.weight(.semibold))
                    .strikethrough(missed)
                if let pos = player.position {
                    Text(pos)
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }

            Spacer()

            HStack(spacing: 4) {
                StatPillView(label: "PTS", value: player.ptsPg)
                StatPillView(label: "AST", value: player.astPg)
                StatPillView(label: "REB", value: player.rebPg)
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .glassCard(cornerRadius: 10, interactive: false)
        .overlay(
            // Red border for missed players distinguishes them from correctly named ones
            // without needing a separate list section.
            missed
                ? AnyView(RoundedRectangle(cornerRadius: 10).stroke(Color.red.opacity(0.4), lineWidth: 1))
                : AnyView(EmptyView())
        )
        .opacity(missed ? 0.6 : 1.0)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(player.fullName)\(missed ? ", not guessed" : "")")
    }
}

// MARK: - Previews

#Preview("RosterPlayerRowView — Named") {
    RosterPlayerRowView(player: NamedPlayer(
        playerId: 2544,
        fullName: "LeBron James",
        position: "SF",
        jerseyNumber: "23",
        ptsPg: 27.1,
        astPg: 7.4,
        rebPg: 7.4,
        index: 0
    ))
    .padding()
}

#Preview("RosterPlayerRowView — Missed") {
    RosterPlayerRowView(
        player: NamedPlayer(
            playerId: 893,
            fullName: "Magic Johnson",
            position: "PG",
            jerseyNumber: "32",
            ptsPg: 19.5,
            astPg: 11.2,
            rebPg: 7.2,
            index: 1
        ),
        missed: true
    )
    .padding()
}
