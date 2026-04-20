import SwiftUI

/// A pulsing placeholder skeleton used during loading states.
///
/// Renders a configurable number of rounded rectangle rows that animate between
/// low and high opacity to indicate content is on the way. Each row is staggered
/// by 100 ms for a wave effect.
///
/// Place this view wherever content has a defined height but data hasn't arrived
/// yet, following the HIG guidance to prefer skeleton screens over spinners for
/// list/grid content.
///
/// - Example:
///   ```swift
///   if viewModel.isLoading {
///       LoadingSkeletonView(rows: 4)
///   } else {
///       PlayerListView(players: viewModel.players)
///   }
///   ```
struct LoadingSkeletonView: View {

    /// Number of placeholder rows to render. Defaults to `5`.
    var rows: Int = 5

    @State private var opacity: Double = 0.4

    var body: some View {
        VStack(spacing: 12) {
            ForEach(0..<rows, id: \.self) { index in
                RoundedRectangle(cornerRadius: 8)
                    .fill(.quaternary)
                    .frame(height: 56)
                    .opacity(opacity)
                    .animation(
                        .easeInOut(duration: 0.9)
                        .repeatForever(autoreverses: true)
                        // Stagger each row by 100 ms for a cascading wave.
                        .delay(Double(index) * 0.1),
                        value: opacity
                    )
            }
        }
        .padding()
        .onAppear { opacity = 0.9 }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Loading")
    }
}

// MARK: - Previews

#Preview("LoadingSkeletonView") {
    LoadingSkeletonView(rows: 5)
}

#Preview("LoadingSkeletonView — Dark, 3 rows") {
    LoadingSkeletonView(rows: 3)
        .preferredColorScheme(.dark)
        .background(Color(.systemBackground))
}
