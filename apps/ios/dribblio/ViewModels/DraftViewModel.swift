import Foundation
import Observation

/// Manages the NBA All-Time Draft session state and socket lifecycle.
///
/// Mirrors `DraftProvider.tsx` exactly: same state shape, same socket event handling,
/// same action surface. All mutations are `@MainActor`-isolated; socket callbacks
/// dispatched from `SocketClient` arrive on the main queue, satisfying Swift 6
/// concurrency requirements without explicit `DispatchQueue.main.async` at the call site.
///
/// - Example:
///   ```swift
///   @State private var viewModel = DraftViewModel()
///   viewModel.createRoom(name: "Cameron")
///   ```
@MainActor
@Observable
final class DraftViewModel {

    // MARK: - Public state

    private(set) var phase: DraftPhase = .entrance
    private(set) var roomId: String? = nil
    private(set) var myParticipantId: String? = nil
    private(set) var myName: String? = nil
    private(set) var isOrganizer: Bool = false
    private(set) var participants: [Participant] = []
    private(set) var config: DraftRoomConfig? = nil
    private(set) var pool: [PoolEntry] = []
    private(set) var turnOrder: [String] = []
    private(set) var currentTurnIndex: Int = 0
    private(set) var currentRound: Int = 1
    private(set) var pickHistory: [PickRecord] = []
    private(set) var invalidatedEntryIds: Set<String> = []
    var errorMessage: String? = nil

    // MARK: - Computed

    /// Whether it is currently this client's turn to pick.
    var isMyTurn: Bool {
        guard !turnOrder.isEmpty, let myId = myParticipantId else { return false }
        return turnOrder.indices.contains(currentTurnIndex) && turnOrder[currentTurnIndex] == myId
    }

    /// The `Participant` whose turn it currently is, or `nil` if the turn order is empty.
    var currentTurnParticipant: Participant? {
        guard turnOrder.indices.contains(currentTurnIndex) else { return nil }
        let id = turnOrder[currentTurnIndex]
        return participants.first { $0.participantId == id }
    }

    // MARK: - Socket

    private var socket: (any SocketClientProtocol)?
    private let socketFactory: (String, [String: String]) -> any SocketClientProtocol

    /// - Parameter socketFactory: Optional factory override for testing. Defaults to `SocketClient`.
    init(socketFactory: ((String, [String: String]) -> any SocketClientProtocol)? = nil) {
        self.socketFactory = socketFactory ?? { namespace, query in
            SocketClient(namespace: namespace, query: query)
        }
    }

    deinit {
        // deinit is nonisolated; direct socket access is unsafe on @MainActor class.
        // The socket will be cleaned up when the object is released.
    }

    // MARK: - Public actions

    /// Creates a new draft room by connecting without a `roomId`, waits for `ROOM_CREATED`,
    /// then reconnects with the assigned room ID and emits `PARTICIPANT_JOINED`.
    ///
    /// - Parameter name: The display name for this participant.
    func createRoom(name: String) async {
        // Connecting without a roomId causes the gateway to emit ROOM_CREATED
        // with the server-generated room ID, then we swap to the real connection.
        let tempSocket = socketFactory("/draft", [:])

        do {
            let newRoomId = try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<String, Error>) in
                nonisolated(unsafe) var settled = false
                tempSocket.on("ROOM_CREATED") { data in
                    guard !settled,
                          let payload = try? decodeSocketPayload(RoomCreatedPayload.self, from: data)
                    else { return }
                    settled = true
                    continuation.resume(returning: payload.roomId)
                }
                tempSocket.on("connect_error") { _ in
                    guard !settled else { return }
                    settled = true
                    continuation.resume(throwing: NSError(
                        domain: "DraftViewModel",
                        code: -1,
                        userInfo: [NSLocalizedDescriptionKey: "Failed to create room"]
                    ))
                }
                tempSocket.connect()
            }

            tempSocket.disconnect()
            connectSocket(roomId: newRoomId)

            let participantId = UUID().uuidString
            myParticipantId = participantId
            myName = name
            roomId = newRoomId
            isOrganizer = true
            phase = .lobby

            socket?.emit("PARTICIPANT_JOINED", [[
                "participant": [
                    "participantId": participantId,
                    "name": name,
                    "isOrganizer": true
                ]
            ]])
        } catch {
            tempSocket.disconnect()
            errorMessage = error.localizedDescription
        }
    }

    /// Joins an existing room and emits `PARTICIPANT_JOINED`.
    ///
    /// - Parameters:
    ///   - roomId: The room code to join.
    ///   - name: The display name for this participant.
    func joinRoom(roomId: String, name: String) {
        connectSocket(roomId: roomId)
        let participantId = UUID().uuidString
        myParticipantId = participantId
        myName = name
        self.roomId = roomId
        isOrganizer = false
        phase = .lobby
        socket?.emit("PARTICIPANT_JOINED", [[
            "participant": [
                "participantId": participantId,
                "name": name,
                "isOrganizer": false
            ]
        ]])
    }

    /// Transitions to `.configuring` and emits `ORGANIZER_CONFIGURE` + `SAVE_CONFIG`.
    ///
    /// - Parameter config: The draft configuration chosen by the organizer.
    func saveConfig(_ config: DraftRoomConfig) {
        phase = .configuring
        socket?.emit("ORGANIZER_CONFIGURE", [])
        if let data = try? JSONEncoder().encode(config),
           let dict = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
            socket?.emit("SAVE_CONFIG", [["config": dict]])
        }
    }

    /// Emits `ORGANIZER_START_DRAFT` to begin the draft.
    func startDraft() {
        socket?.emit("ORGANIZER_START_DRAFT", [])
    }

    /// Submits the current participant's pick for the given entry.
    ///
    /// - Parameter entryId: The `entryId` of the pool entry to draft.
    func submitPick(entryId: String) {
        guard let participantId = myParticipantId else { return }
        socket?.emit("SUBMIT_PICK", [[
            "pickRecord": [
                "participantId": participantId,
                "entryId": entryId,
                "round": currentRound
            ]
        ]])
    }

    /// Notifies the server that the client-side turn timer has expired.
    func notifyTimerExpired() {
        socket?.emit("TURN_TIMER_EXPIRED", [])
    }

    /// Emits `PARTICIPANT_LEFT`, disconnects the socket, and resets all state.
    func leave() {
        if let id = myParticipantId {
            socket?.emit("PARTICIPANT_LEFT", [["participantId": id]])
        }
        socket?.disconnect()
        socket = nil
        resetState()
    }

    // MARK: - Private

    private func connectSocket(roomId: String) {
        socket?.disconnect()
        let s = socketFactory("/draft", ["roomId": roomId])
        registerHandlers(on: s)
        s.connect()
        socket = s
    }

    private func resetState() {
        phase = .entrance
        roomId = nil
        myParticipantId = nil
        myName = nil
        isOrganizer = false
        participants = []
        config = nil
        pool = []
        turnOrder = []
        currentTurnIndex = 0
        currentRound = 1
        pickHistory = []
        invalidatedEntryIds = []
        errorMessage = nil
    }

    private func registerHandlers(on socket: any SocketClientProtocol) {
        // Callbacks are dispatched to the main queue by SocketClient.
        // MainActor.assumeIsolated is safe here because we verify dispatch in SocketClient.on.
        socket.on("NOTIFY_PARTICIPANT_JOINED") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                guard let self,
                      let payload = try? decodeSocketPayload(NotifyParticipantJoinedPayload.self, from: d)
                else { return }
                self.participants = payload.participants
            }
        }

        socket.on("NOTIFY_PARTICIPANT_LEFT") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                guard let self,
                      let payload = try? decodeSocketPayload(NotifyParticipantLeftPayload.self, from: d)
                else { return }
                self.participants.removeAll { $0.participantId == payload.participantId }
            }
        }

        socket.on("NOTIFY_CONFIG_SAVED") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                guard let self,
                      let payload = try? decodeSocketPayload(NotifyConfigSavedPayload.self, from: d)
                else { return }
                self.config = payload.config
                self.pool = payload.pool
                self.phase = .poolPreview
            }
        }

        socket.on("NOTIFY_DRAFT_STARTED") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                guard let self,
                      let payload = try? decodeSocketPayload(NotifyDraftStartedPayload.self, from: d)
                else { return }
                self.pool = payload.pool
                self.turnOrder = payload.turnOrder
                self.currentTurnIndex = 0
                self.currentRound = 1
                self.pickHistory = []
                self.invalidatedEntryIds = []
                self.phase = .drafting
            }
        }

        socket.on("NOTIFY_PICK_CONFIRMED") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                guard let self,
                      let payload = try? decodeSocketPayload(NotifyPickConfirmedPayload.self, from: d)
                else { return }
                self.pickHistory.append(payload.pickRecord)
            }
        }

        socket.on("NOTIFY_POOL_UPDATED") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                guard let self,
                      let payload = try? decodeSocketPayload(NotifyPoolUpdatedPayload.self, from: d)
                else { return }
                payload.invalidatedIds.forEach { self.invalidatedEntryIds.insert($0) }
            }
        }

        socket.on("NOTIFY_TURN_ADVANCED") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                guard let self,
                      let payload = try? decodeSocketPayload(NotifyTurnAdvancedPayload.self, from: d)
                else { return }
                self.currentTurnIndex = payload.currentTurnIndex
                self.currentRound = payload.currentRound
            }
        }

        socket.on("NOTIFY_DRAFT_COMPLETE") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                guard let self,
                      let payload = try? decodeSocketPayload(NotifyDraftCompletePayload.self, from: d)
                else { return }
                self.pickHistory = payload.pickHistory
                self.phase = .results
            }
        }

        socket.on("ERROR") { [weak self] data in
            nonisolated(unsafe) let d = data
            MainActor.assumeIsolated {
                if let msg = (d.first as? [String: Any])?["message"] as? String {
                    self?.errorMessage = msg
                }
            }
        }
    }
}
