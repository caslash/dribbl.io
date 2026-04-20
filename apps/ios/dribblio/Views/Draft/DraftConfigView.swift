import SwiftUI

/// Organizer-only form for configuring draft settings before the pool is generated.
///
/// Uses a SwiftUI `Form` (the HIG-recommended control for settings screens) with
/// segmented pickers for discrete choices and steppers for bounded numeric inputs.
/// Emits `saveConfig` on the view model when the organizer taps "Save Config".
struct DraftConfigView: View {

    let viewModel: DraftViewModel

    // MARK: - Local form state

    @State private var draftMode: DraftMode = .mvp
    @State private var draftOrder: DraftOrder = .snake
    @State private var maxRounds: Int = 5
    @State private var timerEnabled: Bool = false
    @State private var turnDuration: Int = 60

    // MARK: - Body

    var body: some View {
        Form {
            Section("Draft Mode") {
                Picker("Mode", selection: $draftMode) {
                    Text("MVP").tag(DraftMode.mvp)
                    Text("Franchise").tag(DraftMode.franchise)
                }
                .pickerStyle(.segmented)
                .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
            }

            Section("Draft Order") {
                Picker("Order", selection: $draftOrder) {
                    Text("Snake").tag(DraftOrder.snake)
                    Text("Linear").tag(DraftOrder.linear)
                }
                .pickerStyle(.segmented)
                .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
            }

            Section("Rounds") {
                Stepper("Max Rounds: \(maxRounds)", value: $maxRounds, in: 1...10)
            }

            Section("Turn Timer") {
                Toggle("Enable Timer", isOn: $timerEnabled)
                if timerEnabled {
                    Stepper(
                        "Duration: \(turnDuration)s",
                        value: $turnDuration,
                        in: 15...120,
                        step: 5
                    )
                }
            }

            Section {
                Button(action: submit) {
                    HStack {
                        if viewModel.phase == .configuring {
                            ProgressView()
                                .controlSize(.small)
                                .padding(.trailing, 6)
                        }
                        Text(viewModel.phase == .configuring ? "Saving…" : "Save Config")
                            .fontWeight(.semibold)
                            .frame(maxWidth: .infinity)
                    }
                }
                .disabled(viewModel.phase == .configuring)
            }
        }
        .navigationTitle("Configure Draft")
        .navigationBarTitleDisplayMode(.inline)
    }

    // MARK: - Actions

    private func submit() {
        let config = DraftRoomConfig(
            draftMode: draftMode,
            draftOrder: draftOrder,
            maxRounds: maxRounds,
            turnDuration: timerEnabled ? turnDuration : nil
        )
        viewModel.saveConfig(config)
    }
}

// MARK: - Preview

#Preview("DraftConfigView") {
    NavigationStack {
        DraftConfigView(viewModel: DraftViewModel())
    }
}

#Preview("DraftConfigView — Dark") {
    NavigationStack {
        DraftConfigView(viewModel: DraftViewModel())
    }
    .preferredColorScheme(.dark)
}
