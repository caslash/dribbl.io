import Foundation

struct APIResponse: Decodable {
    let resultSets: [ResultSet]
    
    struct ResultSet: Decodable {
        let name: String
        let headers: [String]
        let rowSet: [[JSONValue]]
    }
}

protocol RowInitializable: Codable {
    init(from row: [JSONValue], headers: [String]) throws
}

extension RowInitializable {
    func value(for key: String, from row: [JSONValue], headers: [String]) -> JSONValue? {
        guard let index = headers.firstIndex(of: key) else { return nil }
        return row[index]
    }
}

extension APIResponse.ResultSet {
    func rows<T: RowInitializable>(of type: T.Type) throws -> [T] {
        try rowSet.map { try T(from: $0, headers: headers) }
    }
}

// Helper on the array of resultSets
extension Array where Element == APIResponse.ResultSet {
    func rows<T: RowInitializable>(
      of type: T.Type,
      named name: String
    ) throws -> [T] {
        guard let set = first(where: { $0.name == name }) else { return [] }
        return try set.rows(of: type)
    }
}
