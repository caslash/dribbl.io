import SwiftUI

/// A skeleton placeholder for an un-guessed roster slot in the playing state.
///
/// Maintains the same height as `RosterPlayerRowView` so the layout doesn't
/// shift when a correct guess replaces a placeholder.
struct RosterPlayerRowPlaceholder: View {
    let index: Int

    var body: some View {
        HStack(spacing: 12) {
            Text("?")
                .font(.caption.weight(.bold))
                .foregroundStyle(.quaternary)
                .frame(width: 32, alignment: .trailing)
            Circle()
                .fill(.quaternary)
                .frame(width: 40, height: 40)
            RoundedRectangle(cornerRadius: 4)
                .fill(.quaternary)
                .frame(height: 16)
                .frame(maxWidth: .infinity)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .glassCard(cornerRadius: 10, interactive: false)
        .opacity(0.5)
        .accessibilityLabel("Unknown player \(index + 1)")
    }
}

// MARK: - Preview

#Preview("RosterPlayerRowPlaceholder") {
    VStack(spacing: 6) {
        RosterPlayerRowPlaceholder(index: 0)
        RosterPlayerRowPlaceholder(index: 1)
        RosterPlayerRowPlaceholder(index: 2)
    }
    .padding()
}
