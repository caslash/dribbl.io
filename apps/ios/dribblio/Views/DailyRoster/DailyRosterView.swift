import SwiftUI

/// Root view for the Daily Roster tab.
///
/// Owns the date navigation bar and fetches the earliest available challenge
/// date to bound the back-navigation affordance. Re-keying `DailyRosterContentView`
/// on `selectedDate` forces a full remount — and therefore a fresh `ViewModel` —
/// whenever the user navigates to a different date.
struct DailyRosterView: View {

    @State private var selectedDate: String = Date.localDateString()
    @State private var earliestDate: String? = nil

    // MARK: - Computed

    private var canGoBack: Bool {
        guard let earliest = earliestDate else { return false }
        return selectedDate > earliest
    }

    private var canGoForward: Bool {
        selectedDate < Date.localDateString()
    }

    // MARK: - Body

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                dateNavigationBar
                DailyRosterContentView(date: selectedDate)
                    // Forces remount + new ViewModel whenever the date changes.
                    .id(selectedDate)
            }
            .navigationTitle("Daily Roster")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(.ultraThinMaterial, for: .navigationBar)
        }
        .task {
            earliestDate = try? await APIClient.shared.fetchEarliestDate()
        }
    }

    // MARK: - Subviews

    private var dateNavigationBar: some View {
        HStack {
            Button {
                if let prev = Date.shiftDateString(selectedDate, by: -1) {
                    selectedDate = prev
                }
            } label: {
                Image(systemName: "chevron.left")
                    .accessibilityLabel("Previous day")
            }
            .disabled(!canGoBack)

            Spacer()

            Text(formattedDate)
                .font(.subheadline.weight(.semibold))
                .accessibilityLabel("Selected date: \(formattedDate)")

            Spacer()

            Button {
                if let next = Date.shiftDateString(selectedDate, by: 1) {
                    selectedDate = next
                }
            } label: {
                Image(systemName: "chevron.right")
                    .accessibilityLabel("Next day")
            }
            .disabled(!canGoForward)
        }
        .padding(.horizontal)
        .padding(.vertical, 12)
    }

    // MARK: - Helpers

    private var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.locale = Locale(identifier: "en_US_POSIX")
        guard let date = formatter.date(from: selectedDate) else { return selectedDate }
        let display = DateFormatter()
        display.dateStyle = .medium
        return display.string(from: date)
    }
}

// MARK: - Previews

#Preview("DailyRosterView") {
    DailyRosterView()
}

#Preview("DailyRosterView — Dark") {
    DailyRosterView()
        .preferredColorScheme(.dark)
}
