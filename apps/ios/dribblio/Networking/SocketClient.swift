import Foundation
import SocketIO

// MARK: - Protocol

/// Minimal interface over a Socket.io client for a single namespace connection.
/// Expressed as a protocol to allow test doubles and alternative implementations.
protocol SocketClientProtocol: AnyObject {
    /// Opens the Socket.io connection.
    func connect()
    /// Closes the Socket.io connection.
    func disconnect()
    /// Emits an event with the given items to the server.
    ///
    /// - Parameters:
    ///   - event: The event name.
    ///   - items: Serialisable payload items (String, Int, [Any], [String: Any], etc.).
    func emit(_ event: String, _ items: [Any])
    /// Registers a listener for the given event.
    ///
    /// The callback is always dispatched on the main queue.
    ///
    /// - Parameters:
    ///   - event: The event name to listen for.
    ///   - callback: Called with the raw payload array when the event fires.
    func on(_ event: String, callback: @escaping @Sendable ([Any]) -> Void)
}

// MARK: - Implementation

/// Socket.io client wrapping `socket.io-client-swift` for a single namespace.
///
/// @example
/// ```swift
/// let socket = SocketClient(namespace: "/careerpath")
/// socket.on("NOTIFY_NEXT_ROUND") { data in
///     guard let payload = try? decodeSocketPayload(NotifyNextRound.self, from: data) else { return }
///     // handle payload
/// }
/// socket.connect()
/// ```
final class SocketClient: SocketClientProtocol {

    private let manager: SocketManager
    private let socket: SocketIOClient

    /// - Parameters:
    ///   - namespace: The Socket.io namespace path, e.g. `"/careerpath"`.
    ///   - baseURL: The server base URL. Defaults to `Bundle.main.backendURL`.
    ///   - query: Optional query parameters appended to the connection URL.
    init(namespace: String, baseURL: URL = Bundle.main.backendURL, query: [String: String] = [:]) {
        var options: SocketIOClientConfiguration = [
            .log(false),
            .compress,
            .forceWebsockets(true)
        ]
        if !query.isEmpty {
            options.insert(.connectParams(query))
        }
        manager = SocketManager(socketURL: baseURL, config: options)
        socket = manager.socket(forNamespace: namespace)
    }

    func connect() {
        socket.connect()
    }

    func disconnect() {
        socket.disconnect()
    }

    func emit(_ event: String, _ items: [Any]) {
        socket.emit(event, items)
    }

    func on(_ event: String, callback: @escaping @Sendable ([Any]) -> Void) {
        // socket.io-client-swift delivers [Any] payloads which are not Sendable.
        // We marshal to the main queue immediately; suppressing the sendability
        // warning here is safe because we never mutate `data` after the dispatch.
        socket.on(event) { data, _ in
            nonisolated(unsafe) let payload = data
            DispatchQueue.main.async {
                callback(payload)
            }
        }
    }
}

// MARK: - Payload Decoding Helper

/// Decodes a typed `Decodable` value from a raw Socket.io payload array.
///
/// The first element of `data` is used as the JSON object. If the array is empty,
/// an empty dictionary is substituted.
///
/// - Parameters:
///   - type: The `Decodable` type to decode into.
///   - data: The raw `[Any]` array received from a Socket.io event handler.
/// - Returns: A decoded value of type `T`.
/// - Throws: `JSONSerialization` or `JSONDecoder` errors on malformed input.
///
/// @example
/// ```swift
/// socket.on("NOTIFY_NEXT_ROUND") { data in
///     guard let payload = try? decodeSocketPayload(NotifyNextRound.self, from: data) else { return }
///     // use payload
/// }
/// ```
func decodeSocketPayload<T: Decodable>(_ type: T.Type, from data: [Any]) throws -> T {
    let jsonObject = data.first ?? [:]
    let jsonData = try JSONSerialization.data(withJSONObject: jsonObject)
    return try JSONDecoder().decode(type, from: jsonData)
}
