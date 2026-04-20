import SwiftUI

// MARK: - Difficulty Option Model

/// A single difficulty option for the Career Path config screen.
private struct DifficultyOption: Identifiable {
    let id: String
    let title: String
    let description: String
}

private let difficultyOptions: [DifficultyOption] = [
    DifficultyOption(
        id: "firstAllNBA",
        title: "First-Team All-NBA",
        description: "Only the best of the best — players who earned First-Team honors."
    ),
    DifficultyOption(
        id: "allNBA",
        title: "All-NBA",
        description: "All-NBA selectees from any team across every era."
    ),
    DifficultyOption(
        id: "greatest75",
        title: "Greatest 75",
        description: "The NBA's officially recognised 75 greatest players of all time."
    ),
    DifficultyOption(
        id: "allPlayers",
        title: "All Players",
        description: "Any player who has ever appeared in an NBA regular-season game."
    ),
]

private let livesOptions: [(label: String, value: Int?)] = [
    ("3", 3),
    ("5", 5),
    ("10", 10),
    ("∞", nil),
]

// MARK: - View

/// Configuration screen where the player selects difficulty and lives before starting.
struct CareerPathConfigView: View {

    let viewModel: CareerPathViewModel

    @State private var selectedDifficulty: String = "greatest75"
    @State private var selectedLives: Int? = nil

    var body: some View {
        ScrollView {
            VStack(spacing: 32) {
                header
                difficultySection
                livesSection
                startButton
            }
            .padding(.horizontal)
            .padding(.bottom, 32)
        }
    }

    // MARK: - Subviews

    private var header: some View {
        VStack(spacing: 8) {
            Text("Career Path")
                .font(.largeTitle.weight(.bold)).fontDesign(.serif)
                .multilineTextAlignment(.center)
            Text("Test your NBA knowledge")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding(.top, 24)
    }

    private var difficultySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("DIFFICULTY")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)

            VStack(spacing: 8) {
                ForEach(difficultyOptions) { option in
                    difficultyCard(option)
                }
            }
        }
    }

    private func difficultyCard(_ option: DifficultyOption) -> some View {
        let isSelected = selectedDifficulty == option.id

        return Button {
            selectedDifficulty = option.id
        } label: {
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(option.title)
                        .font(.headline)
                        .foregroundStyle(.primary)
                    Text(option.description)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
                Spacer()
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(.tint)
                        .font(.title3)
                }
            }
            .padding()
            .glassCard(
                cornerRadius: 12,
                interactive: true
            )
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Color.accentColor : Color.clear, lineWidth: 2)
            )
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(isSelected ? [.isSelected] : [])
    }

    private var livesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("LIVES")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)

            HStack(spacing: 8) {
                ForEach(livesOptions, id: \.label) { option in
                    livesButton(label: option.label, value: option.value)
                }
            }
        }
    }

    private func livesButton(label: String, value: Int?) -> some View {
        let isSelected = selectedLives == value

        return Button {
            selectedLives = value
        } label: {
            Text(label)
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .glassCard(cornerRadius: 10, interactive: true)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(isSelected ? Color.accentColor : Color.clear, lineWidth: 2)
                )
        }
        .buttonStyle(.plain)
        .accessibilityLabel(value.map { "\($0) lives" } ?? "Infinite lives")
        .accessibilityAddTraits(isSelected ? [.isSelected] : [])
    }

    private var startButton: some View {
        Button {
            viewModel.saveConfig(
                CareerPathConfig(
                    lives: selectedLives,
                    gameDifficulty: selectedDifficulty
                )
            )
        } label: {
            Text("Start Game")
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
        }
        .buttonStyle(.borderedProminent)
        .tint(.accentColor)
        .controlSize(.large)
    }
}

// MARK: - Previews

#Preview("Config — Light") {
    CareerPathConfigView(viewModel: CareerPathViewModel())
}

#Preview("Config — Dark") {
    CareerPathConfigView(viewModel: CareerPathViewModel())
        .preferredColorScheme(.dark)
}
