import Foundation

public struct CommonPlayerInfo: ResponseInitializable {
    var personId: Int
    var firstName: String
    var lastName: String
    var displayName: String
    var birthdate: Date
    var school: String
    var country: String
    var height: String
    var weight: Int
    var seasonExp: Int
    var jersey: String?
    var position: String
    var rosterStatus: String
    var teamId: Int
    var teamName: String
    var teamAbbreviation: String
    var teamCity: String
    var fromYear: Int
    var toYear: Int
    var draftYear: String?
    var draftRound: String?
    var draftNumber: String?

    public init(from data: Data) throws {
        let decoder = JSONDecoder()
        let resp = try decoder.decode(NBAAPIResponse.self, from: data)

        func v(_ key: String) -> JSONValue? {
            guard let i = resp.resultSets[0].headers.firstIndexCaseInsensitive(of: key) else {
                return nil
            }
            return resp.resultSets[0].rowSet[0][i]
        }

        self.personId = v("PERSON_ID")?.intValue ?? 0
        self.firstName = v("FIRST_NAME")?.stringValue ?? ""
        self.lastName = v("LAST_NAME")?.stringValue ?? ""
        self.displayName = v("DISPLAY_FIRST_LAST")?.stringValue ?? ""
        self.birthdate = try Date("\(v("BIRTHDATE")?.stringValue ?? "")Z", strategy: .iso8601)
        self.school = v("SCHOOL")?.stringValue ?? ""
        self.country = v("COUNTRY")?.stringValue ?? ""
        self.height = v("HEIGHT")?.stringValue ?? ""
        self.weight = v("WEIGHT")?.intValue ?? 0
        self.seasonExp = v("SEASON_EXP")?.intValue ?? 0
        self.jersey = v("JERSEY")?.stringValue
        self.position = v("POSITION")?.stringValue ?? ""
        self.rosterStatus = v("ROSTERSTATUS")?.stringValue ?? ""
        self.teamId = v("TEAM_ID")?.intValue ?? 0
        self.teamName = v("TEAM_NAME")?.stringValue ?? ""
        self.teamAbbreviation = v("TEAM_ABBREVIATION")?.stringValue ?? ""
        self.teamCity = v("TEAM_CITY")?.stringValue ?? ""
        self.fromYear = v("FROM_YEAR")?.intValue ?? 0
        self.toYear = v("TO_YEAR")?.intValue ?? 0
        self.draftYear = v("DRAFT_YEAR")?.stringValue ?? ""
        self.draftRound = v("DRAFT_ROUND")?.stringValue ?? ""
        self.draftNumber = v("DRAFT_NUMBER")?.stringValue ?? ""
    }
}
