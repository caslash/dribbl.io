import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            Tab("Home", systemImage: "house.fill") {
                HomeView()
            }
            Tab("Career", systemImage: "figure.basketball") {
                CareerPathView()
            }
            Tab("Draft", systemImage: "person.3.fill") {
                DraftRootView()
            }
            Tab("Daily", systemImage: "calendar") {
                DailyRosterView()
            }
        }
    }
}
