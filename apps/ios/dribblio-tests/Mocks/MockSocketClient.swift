import Foundation
@testable import dribblio

final class MockSocketClient: SocketClientProtocol {
    private(set) var isConnected = false
    private(set) var isDisconnected = false
    private(set) var emittedEvents: [(event: String, data: [Any])] = []
    private var handlers: [String: [([Any]) -> Void]] = [:]

    func connect() { isConnected = true }
    func disconnect() { isDisconnected = true }

    func emit(_ event: String, _ items: [Any]) {
        emittedEvents.append((event: event, data: items))
    }

    func on(_ event: String, callback: @escaping @Sendable ([Any]) -> Void) {
        handlers[event, default: []].append(callback)
    }

    /// Fires all registered handlers for the given event with the provided data.
    func simulateEvent(_ event: String, data: [Any] = []) {
        handlers[event]?.forEach { $0(data) }
    }

    /// Returns true if an event with the given name was emitted.
    func wasEmitted(_ event: String) -> Bool {
        emittedEvents.contains { $0.event == event }
    }

    /// Returns the data payload for the first emitted event matching `event`.
    func dataFor(_ event: String) -> [Any]? {
        emittedEvents.first { $0.event == event }?.data
    }
}
