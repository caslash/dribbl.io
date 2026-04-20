import SwiftUI

// MARK: - Modifier

/// Applies the iOS 26 Liquid Glass effect to any view.
///
/// Prefer the `GlassCard` container for standalone glass surfaces, or the
/// `.glassCard()` modifier when wrapping an existing view hierarchy.
///
/// - Note: Requires iOS 26. Uses `glassEffect(_:in:)` introduced at WWDC 2025.
struct GlassCardModifier: ViewModifier {

    /// Corner radius of the glass surface.
    var cornerRadius: CGFloat

    /// When `true`, applies the interactive glass variant that responds to
    /// press gestures with a subtle depth change (HIG: tappable surfaces
    /// should communicate affordance through visual feedback).
    var interactive: Bool

    func body(content: Content) -> some View {
        content
            .glassEffect(
                interactive ? .regular.interactive(true) : .regular,
                in: .rect(cornerRadius: cornerRadius)
            )
    }
}

// MARK: - View Extension

extension View {

    /// Wraps this view in the iOS 26 Liquid Glass card style.
    ///
    /// - Parameters:
    ///   - cornerRadius: Corner radius of the glass surface. Defaults to `12`.
    ///   - interactive: Whether the glass responds to press gestures. Defaults to `true`.
    ///
    /// - Example:
    ///   ```swift
    ///   Text("Hello")
    ///       .padding()
    ///       .glassCard(cornerRadius: 16, interactive: false)
    ///   ```
    func glassCard(cornerRadius: CGFloat = 12, interactive: Bool = true) -> some View {
        modifier(GlassCardModifier(cornerRadius: cornerRadius, interactive: interactive))
    }
}

// MARK: - Container View

/// A convenience container that applies the Liquid Glass card style to its content.
///
/// Use this for standalone glass surfaces such as info panels, stat cards, or
/// overlay containers. The glass tint adapts automatically to light/dark mode.
///
/// - Example:
///   ```swift
///   GlassCard {
///       Label("NBA Red", systemImage: "basketball")
///   }
///
///   GlassCard(padding: 24, cornerRadius: 20, interactive: false) {
///       TeamLogoView(teamId: 1)
///   }
///   ```
struct GlassCard<Content: View>: View {

    /// Inner padding applied before the glass surface.
    var padding: CGFloat

    /// Corner radius of the glass surface.
    var cornerRadius: CGFloat

    /// Whether the glass responds to press gestures with depth feedback.
    var interactive: Bool

    @ViewBuilder var content: Content

    /// - Parameters:
    ///   - padding: Inner padding. Defaults to `16`.
    ///   - cornerRadius: Corner radius. Defaults to `12`.
    ///   - interactive: Interactive glass variant. Defaults to `true`.
    ///   - content: The view to wrap.
    init(
        padding: CGFloat = 16,
        cornerRadius: CGFloat = 12,
        interactive: Bool = true,
        @ViewBuilder content: () -> Content
    ) {
        self.padding = padding
        self.cornerRadius = cornerRadius
        self.interactive = interactive
        self.content = content()
    }

    var body: some View {
        content
            .padding(padding)
            .glassCard(cornerRadius: cornerRadius, interactive: interactive)
    }
}

// MARK: - Previews

#Preview("GlassCard — Light") {
    ZStack {
        Color.orange.ignoresSafeArea()
        VStack(spacing: 16) {
            GlassCard {
                Label("Career Path", systemImage: "figure.basketball")
                    .font(.headline)
            }
            GlassCard(cornerRadius: 20, interactive: false) {
                Text("Non-interactive")
                    .font(.body)
            }
        }
        .padding()
    }
}

#Preview("GlassCard — Dark") {
    ZStack {
        Color.black.ignoresSafeArea()
        GlassCard {
            Label("NBA All-Time Draft", systemImage: "person.3.fill")
                .font(.headline)
        }
        .padding()
    }
    .preferredColorScheme(.dark)
}
