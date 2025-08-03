import Foundation

enum JSONValue: Decodable {
    case int(Int)
    case double(Double)
    case string(String)
    case bool(Bool)
    case null

    init(from decoder: Decoder) throws {
        let c = try decoder.singleValueContainer()
        if c.decodeNil()           { self = .null }
        else if let i = try? c.decode(Int.self)    { self = .int(i) }
        else if let d = try? c.decode(Double.self) { self = .double(d) }
        else if let b = try? c.decode(Bool.self)   { self = .bool(b) }
        else if let s = try? c.decode(String.self) { self = .string(s) }
        else { throw DecodingError.typeMismatch(
                    JSONValue.self,
                    DecodingError.Context(
                      codingPath: decoder.codingPath,
                      debugDescription: "Unsupported JSONValue"
                    )
                 )
        }
    }

    var stringValue: String? {
        switch self {
        case .string(let s): return s
        case .int(let i):    return String(i)
        case .double(let d): return String(d)
        case .bool(let b):   return String(b)
        case .null:          return nil
        }
    }
    var intValue: Int? {
        switch self {
        case .int(let i):    return i
        case .string(let s): return Int(s)
        case .double(let d): return Int(d)
        default:             return nil
        }
    }
    var doubleValue: Double? {
        switch self {
        case .double(let d): return d
        case .int(let i):    return Double(i)
        case .string(let s): return Double(s)
        default:             return nil
        }
    }
}
