import Testing
import Foundation
@testable import dribblio

@MainActor
@Suite("DraftViewModel")
struct DraftViewModelTests {

    // MARK: - Helpers

    func makeVM() -> (DraftViewModel, MockSocketClient) {
        let mock = MockSocketClient()
        let vm = DraftViewModel(socketFactory: { _, _ in mock })
        return (vm, mock)
    }

    // MARK: - Join Room

    @Test("joinRoom sets identity and emits PARTICIPANT_JOINED")
    func joinRoom_setsIdentityAndEmits() {
        let (vm, mock) = makeVM()
        vm.joinRoom(roomId: "ABC12", name: "Alice")

        #expect(vm.roomId == "ABC12")
        #expect(vm.myName == "Alice")
        #expect(vm.isOrganizer == false)
        #expect(vm.phase == .lobby)
        #expect(mock.wasEmitted("PARTICIPANT_JOINED"))
    }

    // MARK: - Participant Events

    @Test("NOTIFY_PARTICIPANT_JOINED replaces participant list")
    func notifyParticipantJoined_updatesParticipants() throws {
        let (vm, mock) = makeVM()
        vm.joinRoom(roomId: "ABC12", name: "Alice")

        let payload: [String: Any] = [
            "participant": ["participantId": "p2", "name": "Bob", "isOrganizer": true],
            "participants": [
                ["participantId": "p1", "name": "Alice", "isOrganizer": false],
                ["participantId": "p2", "name": "Bob", "isOrganizer": true]
            ]
        ]
        let data = try JSONSerialization.data(withJSONObject: payload)
        let obj = try JSONSerialization.jsonObject(with: data)
        mock.simulateEvent("NOTIFY_PARTICIPANT_JOINED", data: [obj])

        #expect(vm.participants.count == 2)
    }

    @Test("NOTIFY_PARTICIPANT_LEFT removes the departed participant")
    func notifyParticipantLeft_removesParticipant() throws {
        let (vm, mock) = makeVM()
        vm.joinRoom(roomId: "ABC12", name: "Alice")

        // Seed two participants via join event
        let joinPayload: [String: Any] = [
            "participant": ["participantId": "p2", "name": "Bob", "isOrganizer": false],
            "participants": [
                ["participantId": "p1", "name": "Alice", "isOrganizer": false],
                ["participantId": "p2", "name": "Bob", "isOrganizer": false]
            ]
        ]
        let jData = try JSONSerialization.data(withJSONObject: joinPayload)
        let jObj = try JSONSerialization.jsonObject(with: jData)
        mock.simulateEvent("NOTIFY_PARTICIPANT_JOINED", data: [jObj])
        #expect(vm.participants.count == 2)

        // Remove p2
        let leavePayload: [String: Any] = ["participantId": "p2"]
        let lData = try JSONSerialization.data(withJSONObject: leavePayload)
        let lObj = try JSONSerialization.jsonObject(with: lData)
        mock.simulateEvent("NOTIFY_PARTICIPANT_LEFT", data: [lObj])

        #expect(vm.participants.count == 1)
        #expect(vm.participants[0].participantId == "p1")
    }

    // MARK: - Turn Order

    @Test("isMyTurn true when turnOrder places me at currentIndex")
    func isMyTurn_true() throws {
        let (vm, mock) = makeVM()
        vm.joinRoom(roomId: "ABC12", name: "Alice")
        let myId = try #require(vm.myParticipantId)

        let payload: [String: Any] = [
            "pool": [],
            "turnOrder": [myId, "p2"]
        ]
        let data = try JSONSerialization.data(withJSONObject: payload)
        let obj = try JSONSerialization.jsonObject(with: data)
        mock.simulateEvent("NOTIFY_DRAFT_STARTED", data: [obj])

        #expect(vm.isMyTurn == true)
    }

    @Test("isMyTurn false when another participant is at currentIndex")
    func isMyTurn_false() throws {
        let (vm, mock) = makeVM()
        vm.joinRoom(roomId: "ABC12", name: "Alice")
        let myId = try #require(vm.myParticipantId)

        let payload: [String: Any] = [
            "pool": [],
            "turnOrder": ["p2", myId] // p2 is first
        ]
        let data = try JSONSerialization.data(withJSONObject: payload)
        let obj = try JSONSerialization.jsonObject(with: data)
        mock.simulateEvent("NOTIFY_DRAFT_STARTED", data: [obj])

        #expect(vm.isMyTurn == false)
    }

    // MARK: - Draft Start

    @Test("NOTIFY_DRAFT_STARTED sets pool, turnOrder, and drafting phase")
    func notifyDraftStarted_setsState() throws {
        let (vm, mock) = makeVM()
        vm.joinRoom(roomId: "ABC12", name: "Alice")

        let payload: [String: Any] = [
            "pool": [
                [
                    "entryId": "e1",
                    "draftMode": "mvp",
                    "playerId": 23,
                    "playerName": "LeBron James",
                    "season": "2012-13",
                    "ptsPg": 26.8,
                    "astPg": 7.3,
                    "rebPg": 8.0
                ]
            ],
            "turnOrder": ["p1", "p2"]
        ]
        let data = try JSONSerialization.data(withJSONObject: payload)
        let obj = try JSONSerialization.jsonObject(with: data)
        mock.simulateEvent("NOTIFY_DRAFT_STARTED", data: [obj])

        #expect(vm.phase == .drafting)
        #expect(vm.pool.count == 1)
        #expect(vm.turnOrder == ["p1", "p2"])
        #expect(vm.currentTurnIndex == 0)
    }

    // MARK: - Picks

    @Test("NOTIFY_PICK_CONFIRMED appends entry to pickHistory")
    func notifyPickConfirmed_appendsHistory() throws {
        let (vm, mock) = makeVM()
        vm.joinRoom(roomId: "ABC12", name: "Alice")

        // PickRecord requires participantId, entryId, round, pickNumber
        let payload: [String: Any] = [
            "pickRecord": [
                "participantId": "p1",
                "entryId": "e1",
                "round": 1,
                "pickNumber": 1
            ]
        ]
        let data = try JSONSerialization.data(withJSONObject: payload)
        let obj = try JSONSerialization.jsonObject(with: data)
        mock.simulateEvent("NOTIFY_PICK_CONFIRMED", data: [obj])

        #expect(vm.pickHistory.count == 1)
        #expect(vm.pickHistory[0].entryId == "e1")
    }

    @Test("NOTIFY_POOL_UPDATED accumulates invalidated entry IDs across events")
    func notifyPoolUpdated_unionsIds() throws {
        let (vm, mock) = makeVM()
        vm.joinRoom(roomId: "ABC12", name: "Alice")

        let payload1: [String: Any] = ["invalidatedIds": ["e1", "e2"]]
        let d1 = try JSONSerialization.data(withJSONObject: payload1)
        let o1 = try JSONSerialization.jsonObject(with: d1)
        mock.simulateEvent("NOTIFY_POOL_UPDATED", data: [o1])

        let payload2: [String: Any] = ["invalidatedIds": ["e3"]]
        let d2 = try JSONSerialization.data(withJSONObject: payload2)
        let o2 = try JSONSerialization.jsonObject(with: d2)
        mock.simulateEvent("NOTIFY_POOL_UPDATED", data: [o2])

        #expect(vm.invalidatedEntryIds == ["e1", "e2", "e3"])
    }

    @Test("NOTIFY_TURN_ADVANCED updates currentTurnIndex and currentRound")
    func notifyTurnAdvanced_updatesState() throws {
        let (vm, mock) = makeVM()
        vm.joinRoom(roomId: "ABC12", name: "Alice")

        // NotifyTurnAdvancedPayload decodes only currentTurnIndex and currentRound
        let payload: [String: Any] = ["currentTurnIndex": 2, "currentRound": 2]
        let data = try JSONSerialization.data(withJSONObject: payload)
        let obj = try JSONSerialization.jsonObject(with: data)
        mock.simulateEvent("NOTIFY_TURN_ADVANCED", data: [obj])

        #expect(vm.currentTurnIndex == 2)
        #expect(vm.currentRound == 2)
    }

    // MARK: - Draft Complete

    @Test("NOTIFY_DRAFT_COMPLETE sets results phase and replaces pickHistory")
    func notifyDraftComplete_setsPhase() throws {
        let (vm, mock) = makeVM()
        vm.joinRoom(roomId: "ABC12", name: "Alice")

        let payload: [String: Any] = [
            "pickHistory": [
                ["participantId": "p1", "entryId": "e1", "round": 1, "pickNumber": 1]
            ]
        ]
        let data = try JSONSerialization.data(withJSONObject: payload)
        let obj = try JSONSerialization.jsonObject(with: data)
        mock.simulateEvent("NOTIFY_DRAFT_COMPLETE", data: [obj])

        #expect(vm.phase == .results)
        #expect(vm.pickHistory.count == 1)
    }

    // MARK: - Leave

    @Test("leave resets all state and emits PARTICIPANT_LEFT")
    func leave_resetsState() {
        let (vm, mock) = makeVM()
        vm.joinRoom(roomId: "ABC12", name: "Alice")
        vm.leave()

        #expect(vm.phase == .entrance)
        #expect(vm.roomId == nil)
        #expect(vm.myParticipantId == nil)
        #expect(vm.participants.isEmpty)
        #expect(mock.wasEmitted("PARTICIPANT_LEFT"))
    }

    // MARK: - Submit Pick

    @Test("submitPick emits SUBMIT_PICK with participantId and entryId")
    func submitPick_emitsEvent() throws {
        let (vm, mock) = makeVM()
        vm.joinRoom(roomId: "ABC12", name: "Alice")
        let myId = try #require(vm.myParticipantId)

        vm.submitPick(entryId: "entry-42")

        let payload = mock.dataFor("SUBMIT_PICK")?.first as? [String: Any]
        let record = payload?["pickRecord"] as? [String: Any]
        #expect(record?["entryId"] as? String == "entry-42")
        #expect(record?["participantId"] as? String == myId)
    }
}
