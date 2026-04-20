import SwiftUI

/// Landing screen with a brief description of each game mode.
///
/// Cards are purely informational here — navigation into each game happens via the
/// `TabView` bar. The HIG recommends against deep linking from a Home tab directly
/// into other tabs' navigation stacks, so these cards carry no tap action.
struct HomeView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // MARK: - Hero
                    VStack(spacing: 8) {
                        Text("dribbl.io")
                            .font(.system(.largeTitle, design: .serif).weight(.bold))
                        Text("NBA knowledge games for the obsessed fan.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top, 32)

                    // MARK: - Game cards
                    VStack(spacing: 16) {
                        HomeGameCard(
                            title: "Career Path",
                            description: "Guess the player from their career team history. Test your NBA knowledge round after round.",
                            icon: "figure.basketball"
                        )
                        HomeGameCard(
                            title: "NBA Draft",
                            description: "Build your all-time NBA dream team. Draft against friends in real time.",
                            icon: "person.3.fill"
                        )
                        HomeGameCard(
                            title: "Daily Roster",
                            description: "Name every player from a mystery NBA roster. One challenge per day — 3 lives.",
                            icon: "calendar"
                        )
                    }
                    .padding(.horizontal)
                }
                .padding(.bottom, 32)
            }
            .navigationTitle("Home")
            .navigationBarTitleDisplayMode(.large)
            .toolbarBackground(.ultraThinMaterial, for: .navigationBar)
        }
    }
}

// MARK: - HomeGameCard

/// An informational card describing a single game mode on the Home screen.
private struct HomeGameCard: View {
    let title: String
    let description: String
    let icon: String

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundStyle(Color.accentColor)
                    .accessibilityHidden(true)
                Text(title)
                    .font(.title3.weight(.bold))
                Spacer()
            }
            Text(description)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding(20)
        .glassCard(cornerRadius: 16, interactive: false)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(title). \(description)")
    }
}

// MARK: - Previews

#Preview("HomeView — Light") {
    HomeView()
}

#Preview("HomeView — Dark") {
    HomeView()
        .preferredColorScheme(.dark)
}
