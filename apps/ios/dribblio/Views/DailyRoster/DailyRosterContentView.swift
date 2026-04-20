import SwiftUI

/// Creates and owns the `DailyRosterViewModel` for a given date, then routes
/// to the appropriate child view based on `viewModel.phase`.
///
/// This view is intentionally thin — it delegates all rendering to
/// `DailyRosterPlayingView` or `DailyRosterCompleteView` and only owns the
/// ViewModel lifecycle.
struct DailyRosterContentView: View {

    let date: String

    /// Initialized in `init` so the ViewModel is bound to `date` at construction
    /// time. The parent re-keys this view on `date` change, so the ViewModel is
    /// always fresh when the date changes.
    @State private var viewModel: DailyRosterViewModel

    init(date: String) {
        self.date = date
        self._viewModel = State(wrappedValue: DailyRosterViewModel(date: date))
    }

    // MARK: - Body

    var body: some View {
        Group {
            switch viewModel.phase {
            case .loading:
                LoadingSkeletonView(rows: 8)
                    .padding()
            case .playing:
                DailyRosterPlayingView(viewModel: viewModel)
            case .complete:
                DailyRosterCompleteView(viewModel: viewModel)
            }
        }
    }
}

// MARK: - Previews

#Preview("DailyRosterContentView — Loading") {
    DailyRosterContentView(date: Date.localDateString())
}
