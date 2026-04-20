import Foundation

// MARK: - Phase & Config Enums

/// High-level phase of the draft room UI.
enum DraftPhase {
    case entrance, lobby, configuring, poolPreview, drafting, results
}

/// Mirrors the `draftMode` discriminator from the TypeScript `RoomConfig`.
enum DraftMode: String, Codable {
    case mvp, franchise
}

/// Mirrors the `draftOrder` field from the TypeScript `RoomConfig`.
enum DraftOrder: String, Codable {
    case snake, linear
}

/// Room configuration set by the organizer before the draft starts.
struct DraftRoomConfig: Codable {
    let draftMode: DraftMode
    let draftOrder: DraftOrder
    let maxRounds: Int
    /// Per-turn timer in seconds. `nil` means no timer.
    let turnDuration: Int?
}

// MARK: - Pool Entry Types

/// An MVP-season pool entry. Each entry represents one MVP award season for a player.
struct MvpPoolEntry: Codable, Identifiable {
    let entryId: String
    let draftMode: String
    let playerId: Int
    let playerName: String
    let season: String
    let ptsPg: Double?
    let astPg: Double?
    let rebPg: Double?

    var id: String { entryId }
}

/// A franchise-mode pool entry. Each entry ties a player to a specific franchise.
struct FranchisePoolEntry: Codable, Identifiable {
    let entryId: String
    let draftMode: String
    let playerId: Int
    let playerName: String
    let franchiseName: String
    let franchiseAbbr: String

    var id: String { entryId }
}

/// Discriminated union over `MvpPoolEntry` and `FranchisePoolEntry`.
///
/// Decoded by inspecting the `draftMode` field present on every entry.
/// Provides a `subtitle` computed property suitable for pool row secondary text.
enum PoolEntry: Identifiable {
    case mvp(MvpPoolEntry)
    case franchise(FranchisePoolEntry)

    var id: String { entryId }

    var entryId: String {
        switch self {
        case .mvp(let e): e.entryId
        case .franchise(let e): e.entryId
        }
    }

    var playerId: Int {
        switch self {
        case .mvp(let e): e.playerId
        case .franchise(let e): e.playerId
        }
    }

    var playerName: String {
        switch self {
        case .mvp(let e): e.playerName
        case .franchise(let e): e.playerName
        }
    }

    /// Human-readable secondary line for a pool entry row.
    var subtitle: String {
        switch self {
        case .mvp(let e): return "\(e.season) MVP"
        case .franchise(let e): return e.franchiseName
        }
    }
}

extension PoolEntry: Codable {
    private enum CodingKeys: String, CodingKey { case draftMode }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let mode = try container.decode(String.self, forKey: .draftMode)
        switch mode {
        case "mvp":
            self = .mvp(try MvpPoolEntry(from: decoder))
        case "franchise":
            self = .franchise(try FranchisePoolEntry(from: decoder))
        default:
            throw DecodingError.dataCorruptedError(
                forKey: .draftMode,
                in: container,
                debugDescription: "Unknown draftMode: \(mode)"
            )
        }
    }

    func encode(to encoder: Encoder) throws {
        switch self {
        case .mvp(let e): try e.encode(to: encoder)
        case .franchise(let e): try e.encode(to: encoder)
        }
    }
}

// MARK: - Participant & Pick

/// A user participating in a draft room.
struct Participant: Codable, Identifiable {
    let participantId: String
    let name: String
    let isOrganizer: Bool

    var id: String { participantId }
}

/// Records a single draft pick: who picked what entry, in which round and overall pick slot.
struct PickRecord: Codable, Identifiable {
    let participantId: String
    let entryId: String
    let round: Int
    let pickNumber: Int

    var id: String { "\(participantId)_\(entryId)_\(pickNumber)" }
}

// MARK: - Socket Payload Wrappers

/// Payload for `ROOM_CREATED` — server returns the new room ID after creation.
struct RoomCreatedPayload: Decodable { let roomId: String }

/// Payload for `NOTIFY_PARTICIPANT_JOINED`.
struct NotifyParticipantJoinedPayload: Decodable {
    let participant: Participant
    let participants: [Participant]
}

/// Payload for `NOTIFY_PARTICIPANT_LEFT`.
struct NotifyParticipantLeftPayload: Decodable { let participantId: String }

/// Payload for `NOTIFY_CONFIG_SAVED`.
struct NotifyConfigSavedPayload: Decodable {
    let config: DraftRoomConfig
    let pool: [PoolEntry]
}

/// Payload for `NOTIFY_DRAFT_STARTED`.
struct NotifyDraftStartedPayload: Decodable {
    let pool: [PoolEntry]
    let turnOrder: [String]
}

/// Payload for `NOTIFY_PICK_CONFIRMED`.
struct NotifyPickConfirmedPayload: Decodable { let pickRecord: PickRecord }

/// Payload for `NOTIFY_POOL_UPDATED` — lists entry IDs invalidated by the last pick.
struct NotifyPoolUpdatedPayload: Decodable { let invalidatedIds: [String] }

/// Payload for `NOTIFY_TURN_ADVANCED`.
struct NotifyTurnAdvancedPayload: Decodable {
    let currentTurnIndex: Int
    let currentRound: Int
}

/// Payload for `NOTIFY_DRAFT_COMPLETE`.
struct NotifyDraftCompletePayload: Decodable { let pickHistory: [PickRecord] }
