import Foundation

public struct PlayerAwardsList: ResponseInitializable {
  let PlayerAwards: [PlayerAward]

  public init(from data: Data) throws {
    let decoder = JSONDecoder()
    let resp = try decoder.decode(NBAAPIResponse.self, from: data)

    self.PlayerAwards = try resp.resultSets.rows(of: PlayerAward.self, named: "PlayerAwards")
  }
}

public struct PlayerAward: RowInitializable {
  public let PERSON_ID: Int
  public let FIRST_NAME: String
  public let LAST_NAME: String
  public let TEAM: String?
  public let DESCRIPTION: String
  public let ALL_NBA_TEAM_NUMBER: Int?
  public let SEASON: String
  public let MONTH: String?
  public let WEEK: String?
  public let CONFERENCE: String?
  public let TYPE: String
  public let SUBTYPE1: String?
  public let SUBTYPE2: String?
  public let SUBTYPE3: String?
    
    enum CodingKeys: CodingKey {
        case PERSON_ID
        case FIRST_NAME
        case LAST_NAME
        case TEAM
        case DESCRIPTION
        case ALL_NBA_TEAM_NUMBER
        case SEASON
        case MONTH
        case WEEK
        case CONFERENCE
        case TYPE
        case SUBTYPE1
        case SUBTYPE2
        case SUBTYPE3
    }

  init(from row: [JSONValue], headers: [String]) throws {
    func v(_ key: String) -> JSONValue? {
        guard let i = headers.firstIndex(of: key) else { return nil }
        return row[i]
    }

    self.PERSON_ID = v("PERSON_ID")?.intValue ?? 0
    self.FIRST_NAME = v("FIRST_NAME")?.stringValue ?? ""
    self.LAST_NAME = v("LAST_NAME")?.stringValue ?? ""
    self.TEAM = v("TEAM")?.stringValue
    self.DESCRIPTION = v("DESCRIPTION")?.stringValue ?? ""
    self.ALL_NBA_TEAM_NUMBER = v("ALL_NBA_TEAM_NUMBER")?.intValue
    self.SEASON = v("SEASON")?.stringValue ?? ""
    self.MONTH = v("MONTH")?.stringValue
    self.WEEK = v("WEEK")?.stringValue
    self.CONFERENCE = v("CONFERENCE")?.stringValue
    self.TYPE = v("TYPE")?.stringValue ?? ""
    self.SUBTYPE1 = v("SUBTYPE1")?.stringValue
    self.SUBTYPE2 = v("SUBTYPE2")?.stringValue
    self.SUBTYPE3 = v("SUBTYPE3")?.stringValue
  }
    
    public func encode(to encoder: any Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encode(self.PERSON_ID, forKey: .PERSON_ID)
        try container.encode(self.FIRST_NAME, forKey: .FIRST_NAME)
        try container.encode(self.LAST_NAME, forKey: .LAST_NAME)
        if let team = self.TEAM {
            try container.encode(team, forKey: .TEAM)
        } else {
            try container.encodeNil(forKey: .TEAM)
        }
        try container.encode(self.DESCRIPTION, forKey: .DESCRIPTION)
        if let allNBATeamNumber = self.ALL_NBA_TEAM_NUMBER {
            try container.encode(allNBATeamNumber, forKey: .ALL_NBA_TEAM_NUMBER)
        } else {
            try container.encodeNil(forKey: .ALL_NBA_TEAM_NUMBER)
        }
        try container.encode(self.SEASON, forKey: .SEASON)
        if let month = self.MONTH {
            try container.encode(month, forKey: .MONTH)
        } else {
            try container.encodeNil(forKey: .MONTH)
        }
        if let week = self.WEEK {
            try container.encode(week, forKey: .WEEK)
        } else {
            try container.encodeNil(forKey: .WEEK)
        }
        if let conference = self.CONFERENCE {
            try container.encode(conference, forKey: .CONFERENCE)
        } else {
            try container.encodeNil(forKey: .CONFERENCE)
        }
        try container.encode(self.TYPE, forKey: .TYPE)
        if let subtype1 = self.SUBTYPE1 {
            try container.encode(subtype1, forKey: .SUBTYPE1)
        } else {
            try container.encodeNil(forKey: .SUBTYPE1)
        }
        if let subtype2 = self.SUBTYPE2 {
            try container.encode(subtype2, forKey: .SUBTYPE2)
        } else {
            try container.encodeNil(forKey: .SUBTYPE2)
        }
        if let subtype3 = self.SUBTYPE3 {
            try container.encode(subtype3, forKey: .SUBTYPE3)
        } else {
            try container.encodeNil(forKey: .SUBTYPE3)
        }
    }
}
