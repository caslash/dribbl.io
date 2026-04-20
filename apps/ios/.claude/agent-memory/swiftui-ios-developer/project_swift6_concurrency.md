---
name: Swift 6 concurrency patterns in iOS ViewModels
description: Patterns for satisfying Swift 6 strict concurrency in @MainActor @Observable ViewModels that use socket/API callbacks
type: project
---

In this project's ViewModels (`DraftViewModel`, `DailyRosterViewModel`), Swift 6 strict concurrency requires specific patterns:

**SocketClient callbacks mutating @MainActor state:**
Use `MainActor.assumeIsolated { }` inside `@Sendable` socket handler closures. This is safe because `SocketClient.on` always dispatches on `DispatchQueue.main`. Pair with `nonisolated(unsafe) let d = data` inside the outer closure to pass the non-Sendable `[Any]` payload in.

**Non-Sendable stored properties (APIClientProtocol, UserDefaults) on @MainActor class:**
Mark as `nonisolated(unsafe) private let` to suppress the Sendable transfer diagnostic. These are safe because they're only accessed from async contexts that hop back to the main actor.

**`deinit` on @MainActor class:**
`deinit` is nonisolated in Swift 6 — cannot directly access @MainActor-isolated properties. The linter empties the `deinit` body; socket cleanup happens implicitly when the object is deallocated. For explicit cleanup, mark the stored socket as `nonisolated(unsafe)`.

**`nonisolated(unsafe) var settled` in continuations:**
When using `withCheckedThrowingContinuation` inside a `@MainActor` function, any local `var` captured by `@Sendable` closures must be `nonisolated(unsafe)`.

**`APIClientProtocol: Sendable`:**
The protocol is marked `Sendable`. Concrete `APIClient` is already `@unchecked Sendable`. Test doubles (`MockAPIClient`) must be `final class MockAPIClient: APIClientProtocol, @unchecked Sendable` because their `var` result properties would otherwise violate Sendable.

**`SocketClientProtocol` — NOT Sendable:**
Leave `SocketClientProtocol` without `Sendable`. Socket handler closures are `@Sendable` and the payload `[Any]` is bridged with `nonisolated(unsafe)`.

**Why:** Swift 6 enforces actor isolation at the type level. The project uses `SWIFT_VERSION = 6.0` in all build configs.

**How to apply:** Apply these patterns whenever adding new async ViewModels, socket handlers, or test doubles.
