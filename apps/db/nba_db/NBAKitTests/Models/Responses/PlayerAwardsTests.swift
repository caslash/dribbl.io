import Foundation
import Testing
@testable import NBAKit

struct PlayerAwardTests {
    let jsonDecoder: JSONDecoder
    let jsonEncoder: JSONEncoder
    let response: NBAAPIResponse
    let playerAwardsUrl: URL?
    let playerAwardsListUrl: URL?
    
    init() throws {
        self.jsonDecoder = JSONDecoder()
        self.jsonEncoder = JSONEncoder()
        
        let bundles = Bundle.allBundles
        
        var awardsUrl: URL?
        var awardsListUrl: URL?
        for bundle in bundles {
            if let foundPlayerAwards = bundle.url(forResource: "playerawards", withExtension: "json"),
                let foundPlayerAwardsList = bundle.url(forResource: "playerawardslist", withExtension: "json") {
                awardsUrl = foundPlayerAwards
                awardsListUrl = foundPlayerAwardsList
                break
            }

        }
        
        if let awardsUrl {
            self.playerAwardsUrl = awardsUrl
        } else {
            self.playerAwardsUrl = nil
            fatalError("playerawards.json not found in test bundle.")
        }
        
        if let awardsListUrl {
            self.playerAwardsListUrl = awardsListUrl
        } else {
            self.playerAwardsListUrl = nil
            fatalError("playerawardslist.json not found in test bundle.")
        }
        
        let responseExample = try Data(contentsOf: awardsUrl!)
        
        self.response = try self.jsonDecoder.decode(NBAAPIResponse.self, from: responseExample)
    }
    
    @Test func canDecodePlayerAwardArray() throws {
        let responseExample = try Data(contentsOf: self.playerAwardsUrl!)
        let playerawardslist: PlayerAwardsList = try PlayerAwardsList(from: responseExample)
        
        #expect(playerawardslist.PlayerAwards.count == 33)
        #expect(playerawardslist.PlayerAwards.allSatisfy { $0.PERSON_ID == 1628369 })
        #expect(playerawardslist.PlayerAwards.allSatisfy { $0.FIRST_NAME == "Jayson" })
        #expect(playerawardslist.PlayerAwards.allSatisfy { $0.LAST_NAME == "Tatum" })
        
        let descriptions = Set(playerawardslist.PlayerAwards.map { $0.DESCRIPTION })
        #expect(descriptions.contains("All-NBA"))
        #expect(descriptions.contains("All-Rookie Team"))
        #expect(descriptions.contains("NBA All-Star"))
        #expect(descriptions.contains("NBA Champion"))
        #expect(descriptions.contains("Olympic Gold Medal"))
    }

    @Test func canEncodePlayerAwardsList() throws {
        let expectedData = try Data(contentsOf: self.playerAwardsListUrl!)
        
        let responseExample = try Data(contentsOf: self.playerAwardsUrl!)
        let playerawardslist: PlayerAwardsList = try PlayerAwardsList(from: responseExample)
        let actualData: Data = try jsonEncoder.encode(playerawardslist)
        
        let expectedObject = try JSONSerialization.jsonObject(with: expectedData)
        let actualObject = try JSONSerialization.jsonObject(with: actualData)
        
        let expected = try JSONSerialization.data(withJSONObject: expectedObject, options: [.sortedKeys, .prettyPrinted])
        let actual = try JSONSerialization.data(withJSONObject: actualObject, options: [.sortedKeys, .prettyPrinted])
        
        #expect(expected == actual)
    }
    
    @Test func canDecodePlayerAwardAllNBATeam() throws {
        // Test first row - All-NBA Team Third Team 2019-20
        let playerAward: PlayerAward = try PlayerAward(from: response.resultSets[0].rowSet[0], headers: response.resultSets[0].headers)
        
        #expect(playerAward.PERSON_ID == 1628369)
        #expect(playerAward.FIRST_NAME == "Jayson")
        #expect(playerAward.LAST_NAME == "Tatum")
        #expect(playerAward.TEAM == "Boston Celtics")
        #expect(playerAward.DESCRIPTION == "All-NBA")
        #expect(playerAward.ALL_NBA_TEAM_NUMBER == 3)
        #expect(playerAward.SEASON == "2019-20")
        #expect(playerAward.MONTH == nil)
        #expect(playerAward.WEEK == nil)
        #expect(playerAward.CONFERENCE == "East")
        #expect(playerAward.TYPE == "Award")
        #expect(playerAward.SUBTYPE1 == "Kia Motors")
        #expect(playerAward.SUBTYPE2 == "KIANT")
        #expect(playerAward.SUBTYPE3 == nil)
    }
    
    @Test func canDecodePlayerAwardAllNBAFirstTeam() throws {
        // Test second row - All-NBA First Team 2021-22
        let playerAward: PlayerAward = try PlayerAward(from: response.resultSets[0].rowSet[1], headers: response.resultSets[0].headers)
        
        #expect(playerAward.PERSON_ID == 1628369)
        #expect(playerAward.FIRST_NAME == "Jayson")
        #expect(playerAward.LAST_NAME == "Tatum")
        #expect(playerAward.TEAM == "Boston Celtics")
        #expect(playerAward.DESCRIPTION == "All-NBA")
        #expect(playerAward.ALL_NBA_TEAM_NUMBER == 1)
        #expect(playerAward.SEASON == "2021-22")
        #expect(playerAward.MONTH == nil)
        #expect(playerAward.WEEK == nil)
        #expect(playerAward.CONFERENCE == "East")
        #expect(playerAward.TYPE == "Award")
        #expect(playerAward.SUBTYPE1 == "Kia Motors")
        #expect(playerAward.SUBTYPE2 == "KIANT")
        #expect(playerAward.SUBTYPE3 == nil)
    }
    
    @Test func canDecodePlayerAwardAllRookieTeam() throws {
        // Test All-Rookie Team award (row 5)
        let playerAward: PlayerAward = try PlayerAward(from: response.resultSets[0].rowSet[5], headers: response.resultSets[0].headers)
        
        #expect(playerAward.PERSON_ID == 1628369)
        #expect(playerAward.FIRST_NAME == "Jayson")
        #expect(playerAward.LAST_NAME == "Tatum")
        #expect(playerAward.TEAM == "Boston Celtics")
        #expect(playerAward.DESCRIPTION == "All-Rookie Team")
        #expect(playerAward.ALL_NBA_TEAM_NUMBER == 1)
        #expect(playerAward.SEASON == "2017-18")
        #expect(playerAward.MONTH == nil)
        #expect(playerAward.WEEK == nil)
        #expect(playerAward.CONFERENCE == "East")
        #expect(playerAward.TYPE == "Award")
        #expect(playerAward.SUBTYPE1 == "Kia Motors")
        #expect(playerAward.SUBTYPE2 == "KIART")
        #expect(playerAward.SUBTYPE3 == nil)
    }
    
    @Test func canDecodePlayerAwardAllStar() throws {
        // Test NBA All-Star award with null values (row 6)
        let playerAward: PlayerAward = try PlayerAward(from: response.resultSets[0].rowSet[6], headers: response.resultSets[0].headers)
        
        #expect(playerAward.PERSON_ID == 1628369)
        #expect(playerAward.FIRST_NAME == "Jayson")
        #expect(playerAward.LAST_NAME == "Tatum")
        #expect(playerAward.TEAM == nil)
        #expect(playerAward.DESCRIPTION == "NBA All-Star")
        #expect(playerAward.ALL_NBA_TEAM_NUMBER == nil)
        #expect(playerAward.SEASON == "2019-20")
        #expect(playerAward.MONTH == nil)
        #expect(playerAward.WEEK == nil)
        #expect(playerAward.CONFERENCE == nil)
        #expect(playerAward.TYPE == "Award")
        #expect(playerAward.SUBTYPE1 == "All-Star")
        #expect(playerAward.SUBTYPE2 == nil)
        #expect(playerAward.SUBTYPE3 == nil)
    }
    
    @Test func canDecodePlayerAwardAllStarMVP() throws {
        // Test NBA All-Star MVP award (row 11)
        let playerAward: PlayerAward = try PlayerAward(from: response.resultSets[0].rowSet[11], headers: response.resultSets[0].headers)
        
        #expect(playerAward.PERSON_ID == 1628369)
        #expect(playerAward.FIRST_NAME == "Jayson")
        #expect(playerAward.LAST_NAME == "Tatum")
        #expect(playerAward.TEAM == "Boston Celtics")
        #expect(playerAward.DESCRIPTION == "NBA All-Star Most Valuable Player")
        #expect(playerAward.ALL_NBA_TEAM_NUMBER == nil)
        #expect(playerAward.SEASON == "2022-23")
        #expect(playerAward.MONTH == nil)
        #expect(playerAward.WEEK == nil)
        #expect(playerAward.CONFERENCE == nil)
        #expect(playerAward.TYPE == "Award")
        #expect(playerAward.SUBTYPE1 == "Kia Motors")
        #expect(playerAward.SUBTYPE2 == "KAMVP")
        #expect(playerAward.SUBTYPE3 == nil)
    }
    
    @Test func canDecodePlayerAwardNBAChampion() throws {
        // Test NBA Champion award (row 12)
        let playerAward: PlayerAward = try PlayerAward(from: response.resultSets[0].rowSet[12], headers: response.resultSets[0].headers)
        
        #expect(playerAward.PERSON_ID == 1628369)
        #expect(playerAward.FIRST_NAME == "Jayson")
        #expect(playerAward.LAST_NAME == "Tatum")
        #expect(playerAward.TEAM == "Boston Celtics")
        #expect(playerAward.DESCRIPTION == "NBA Champion")
        #expect(playerAward.ALL_NBA_TEAM_NUMBER == nil)
        #expect(playerAward.SEASON == "2023-24")
        #expect(playerAward.MONTH == nil)
        #expect(playerAward.WEEK == nil)
        #expect(playerAward.CONFERENCE == nil)
        #expect(playerAward.TYPE == "Award")
        #expect(playerAward.SUBTYPE1 == "Champion")
        #expect(playerAward.SUBTYPE2 == nil)
        #expect(playerAward.SUBTYPE3 == nil)
    }
    
    @Test func canDecodePlayerAwardPlayerOfTheMonth() throws {
        // Test NBA Player of the Month award (row 13)
        let playerAward: PlayerAward = try PlayerAward(from: response.resultSets[0].rowSet[13], headers: response.resultSets[0].headers)
        
        #expect(playerAward.PERSON_ID == 1628369)
        #expect(playerAward.FIRST_NAME == "Jayson")
        #expect(playerAward.LAST_NAME == "Tatum")
        #expect(playerAward.TEAM == "Boston Celtics")
        #expect(playerAward.DESCRIPTION == "NBA Player of the Month")
        #expect(playerAward.ALL_NBA_TEAM_NUMBER == nil)
        #expect(playerAward.SEASON == "2019-20")
        #expect(playerAward.MONTH == "2/1/2020")
        #expect(playerAward.WEEK == nil)
        #expect(playerAward.CONFERENCE == "East")
        #expect(playerAward.TYPE == "Award")
        #expect(playerAward.SUBTYPE1 == "Kia Motors")
        #expect(playerAward.SUBTYPE2 == "KIPMO")
        #expect(playerAward.SUBTYPE3 == nil)
    }
    
    @Test func canDecodePlayerAwardPlayerOfTheWeek() throws {
        // Test NBA Player of the Week award (row 18)
        let playerAward: PlayerAward = try PlayerAward(from: response.resultSets[0].rowSet[18], headers: response.resultSets[0].headers)
        
        #expect(playerAward.PERSON_ID == 1628369)
        #expect(playerAward.FIRST_NAME == "Jayson")
        #expect(playerAward.LAST_NAME == "Tatum")
        #expect(playerAward.TEAM == "Boston Celtics")
        #expect(playerAward.DESCRIPTION == "NBA Player of the Week")
        #expect(playerAward.ALL_NBA_TEAM_NUMBER == nil)
        #expect(playerAward.SEASON == "2019-20")
        #expect(playerAward.MONTH == nil)
        #expect(playerAward.WEEK == "2020-02-03T00:00:00")
        #expect(playerAward.CONFERENCE == "East")
        #expect(playerAward.TYPE == "Award")
        #expect(playerAward.SUBTYPE1 == "Kia Motors")
        #expect(playerAward.SUBTYPE2 == "KIPWK")
        #expect(playerAward.SUBTYPE3 == nil)
    }
    
    @Test func canDecodePlayerAwardPlayerOfTheWeekWithSpaceInAllNbaTeamNumber() throws {
        // Test NBA Player of the Week award with space in ALL_NBA_TEAM_NUMBER (row 19)
        let playerAward: PlayerAward = try PlayerAward(from: response.resultSets[0].rowSet[19], headers: response.resultSets[0].headers)
        
        #expect(playerAward.PERSON_ID == 1628369)
        #expect(playerAward.FIRST_NAME == "Jayson")
        #expect(playerAward.LAST_NAME == "Tatum")
        #expect(playerAward.TEAM == "Boston Celtics")
        #expect(playerAward.DESCRIPTION == "NBA Player of the Week")
        #expect(playerAward.ALL_NBA_TEAM_NUMBER == nil)
        #expect(playerAward.SEASON == "2020-21")
        #expect(playerAward.MONTH == nil)
        #expect(playerAward.WEEK == "2021-01-04T00:00:00")
        #expect(playerAward.CONFERENCE == "East")
        #expect(playerAward.TYPE == "Award")
        #expect(playerAward.SUBTYPE1 == "Kia Motors")
        #expect(playerAward.SUBTYPE2 == "KIPWK")
        #expect(playerAward.SUBTYPE3 == nil)
    }
    
    @Test func canDecodePlayerAwardRookieOfTheMonth() throws {
        // Test NBA Rookie of the Month award (row 30)
        let playerAward: PlayerAward = try PlayerAward(from: response.resultSets[0].rowSet[30], headers: response.resultSets[0].headers)
        
        #expect(playerAward.PERSON_ID == 1628369)
        #expect(playerAward.FIRST_NAME == "Jayson")
        #expect(playerAward.LAST_NAME == "Tatum")
        #expect(playerAward.TEAM == "Boston Celtics")
        #expect(playerAward.DESCRIPTION == "NBA Rookie of the Month")
        #expect(playerAward.ALL_NBA_TEAM_NUMBER == nil)
        #expect(playerAward.SEASON == "2017-18")
        #expect(playerAward.MONTH == "2/1/2018")
        #expect(playerAward.WEEK == "1900-01-01T12:00:00")
        #expect(playerAward.CONFERENCE == "East")
        #expect(playerAward.TYPE == "Award")
        #expect(playerAward.SUBTYPE1 == "Kia Motors")
        #expect(playerAward.SUBTYPE2 == "KIRMO")
        #expect(playerAward.SUBTYPE3 == nil)
    }
    
    @Test func canDecodePlayerAwardOlympicGold() throws {
        // Test Olympic Gold Medal award (row 31)
        let playerAward: PlayerAward = try PlayerAward(from: response.resultSets[0].rowSet[31], headers: response.resultSets[0].headers)
        
        #expect(playerAward.PERSON_ID == 1628369)
        #expect(playerAward.FIRST_NAME == "Jayson")
        #expect(playerAward.LAST_NAME == "Tatum")
        #expect(playerAward.TEAM == "USA")
        #expect(playerAward.DESCRIPTION == "Olympic Gold Medal")
        #expect(playerAward.ALL_NBA_TEAM_NUMBER == nil)
        #expect(playerAward.SEASON == "2020")
        #expect(playerAward.MONTH == nil)
        #expect(playerAward.WEEK == nil)
        #expect(playerAward.CONFERENCE == nil)
        #expect(playerAward.TYPE == "Award")
        #expect(playerAward.SUBTYPE1 == "Olympic")
        #expect(playerAward.SUBTYPE2 == "Gold")
        #expect(playerAward.SUBTYPE3 == nil)
    }
    
    @Test func canDecodePlayerAwardOlympicGold2024() throws {
        // Test Olympic Gold Medal award for 2024 (row 32 - last row)
        let playerAward: PlayerAward = try PlayerAward(from: response.resultSets[0].rowSet[32], headers: response.resultSets[0].headers)
        
        #expect(playerAward.PERSON_ID == 1628369)
        #expect(playerAward.FIRST_NAME == "Jayson")
        #expect(playerAward.LAST_NAME == "Tatum")
        #expect(playerAward.TEAM == "USA")
        #expect(playerAward.DESCRIPTION == "Olympic Gold Medal")
        #expect(playerAward.ALL_NBA_TEAM_NUMBER == nil)
        #expect(playerAward.SEASON == "2024")
        #expect(playerAward.MONTH == nil)
        #expect(playerAward.WEEK == nil)
        #expect(playerAward.CONFERENCE == nil)
        #expect(playerAward.TYPE == "Award")
        #expect(playerAward.SUBTYPE1 == "Olympic")
        #expect(playerAward.SUBTYPE2 == "Gold")
        #expect(playerAward.SUBTYPE3 == nil)
    }
}
