import SwiftUI

/// Loads an NBA player headshot from the NBA CDN with an initials fallback.
///
/// Uses the canonical `cdn.nba.com/headshots/nba/latest/1040x760/<id>.png`
/// URL pattern. On failure or while loading, displays a circular placeholder
/// containing the player's initials extracted from `playerName`.
///
/// - Note: `AsyncImage` caches responses via `URLSession`'s shared cache.
///   No additional caching layer is needed for typical list usage.
///
/// - Example:
///   ```swift
///   PlayerHeadshotView(playerId: 2544, playerName: "LeBron James")
///
///   PlayerHeadshotView(playerId: 201939, playerName: "Stephen Curry", width: 64, height: 64)
///   ```
struct PlayerHeadshotView: View {

    /// The NBA player ID used to construct the CDN URL.
    let playerId: Int

    /// The player's full name, used to generate the initials fallback.
    let playerName: String

    /// Width of the rendered circle. Defaults to `44`.
    var width: CGFloat = 44

    /// Height of the rendered circle. Defaults to `44`.
    var height: CGFloat = 44

    // MARK: - Body

    var body: some View {
        AsyncImage(url: headshotURL) { phase in
            switch phase {
            case .success(let image):
                image
                    .resizable()
                    .scaledToFill()
                    .frame(width: width, height: height)
                    .clipShape(Circle())

            case .failure, .empty:
                initialsPlaceholder

            @unknown default:
                Circle()
                    .fill(.quaternary)
                    .frame(width: width, height: height)
            }
        }
        .frame(width: width, height: height)
        .accessibilityLabel(playerName)
        .accessibilityAddTraits(.isImage)
    }

    // MARK: - Subviews

    private var initialsPlaceholder: some View {
        ZStack {
            Circle()
                .fill(.quaternary)
                .frame(width: width, height: height)
            Text(initials)
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
        }
    }

    // MARK: - Helpers

    private var headshotURL: URL? {
        URL(string: "https://cdn.nba.com/headshots/nba/latest/1040x760/\(playerId).png")
    }

    /// Derives up to two initials from `playerName` by taking the first character
    /// of each whitespace-separated component.
    private var initials: String {
        playerName
            .components(separatedBy: " ")
            .compactMap { $0.first }
            .prefix(2)
            .map(String.init)
            .joined()
    }
}

// MARK: - Previews

#Preview("PlayerHeadshotView — Sizes") {
    HStack(spacing: 16) {
        PlayerHeadshotView(playerId: 2544, playerName: "LeBron James", width: 32, height: 32)
        PlayerHeadshotView(playerId: 2544, playerName: "LeBron James", width: 44, height: 44)
        PlayerHeadshotView(playerId: 2544, playerName: "LeBron James", width: 64, height: 64)
    }
    .padding()
}

#Preview("PlayerHeadshotView — Fallback") {
    HStack(spacing: 16) {
        // playerId 0 will 404, triggering the initials fallback
        PlayerHeadshotView(playerId: 0, playerName: "Michael Jordan", width: 44, height: 44)
        PlayerHeadshotView(playerId: 0, playerName: "Kareem Abdul-Jabbar", width: 44, height: 44)
    }
    .padding()
}
