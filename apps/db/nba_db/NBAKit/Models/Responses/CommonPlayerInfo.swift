import Foundation

struct CommonPlayerInfo: Codable {
    let personId: Int
    let firstName: String
    let lastName: String
    let displayName: String
    let birthdate: Date
    let school: String
    let country: String
    let height: String
    let weight: Int
    let seasonExp: Int
    let jersey: String?
    let position: String
    let rosterStatus: String
    let teamId: Int
    let teamName: String
    let teamAbbreviation: String
    let teamCity: String
    let fromYear: Int
    let toYear: Int

    init(from row: [JSONValue], headers: [String]) throws {
        func v(_ key: String) -> JSONValue? {
            guard let i = headers.firstIndex(of: key) else { return nil }
            return row[i]
        }
        
        self.personId = v("PERSON_ID")?.intValue ?? 0
        self.firstName = v("FIRST_NAME")?.stringValue ?? ""
        self.lastName = v("LAST_NAME")?.stringValue ?? ""
        self.displayName = v("DISPLAY_FIRST_LAST")?.stringValue ?? ""
        self.birthdate         = try Date("\(v("BIRTHDATE")?.stringValue ?? "")Z", strategy: .iso8601)
        self.school            = v("SCHOOL")?.stringValue ?? ""
        self.country           = v("COUNTRY")?.stringValue ?? ""
        self.height            = v("HEIGHT")?.stringValue ?? ""
        self.weight            = v("WEIGHT")?.intValue ?? 0
        self.seasonExp         = v("SEASON_EXP")?.intValue    ?? 0
        self.jersey            = v("JERSEY")?.stringValue
        self.position          = v("POSITION")?.stringValue  ?? ""
        self.rosterStatus      = v("ROSTERSTATUS")?.stringValue ?? ""
        self.teamId            = v("TEAM_ID")?.intValue      ?? 0
        self.teamName          = v("TEAM_NAME")?.stringValue ?? ""
        self.teamAbbreviation  = v("TEAM_ABBREVIATION")?.stringValue ?? ""
        self.teamCity          = v("TEAM_CITY")?.stringValue ?? ""
        self.fromYear          = v("FROM_YEAR")?.intValue    ?? 0
        self.toYear            = v("TO_YEAR")?.intValue      ?? 0
    }
}
