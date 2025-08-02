import Foundation
import Testing
@testable import NBAKit

struct CommonPlayerInfoTests {
    let jsonDecoder: JSONDecoder
    let responseData: Data
    
    init() throws {
        self.jsonDecoder = JSONDecoder()

        let bundles = Bundle.allBundles
        
        var url: URL?
        for bundle in bundles {
            if let foundURL = bundle.url(forResource: "commonplayerinfo", withExtension: "json") {
                url = foundURL
                break
            }
        }
        
        guard let url = url else {
            fatalError("commonplayerinfo.json not found in test bundle.")
        }
        
        self.responseData = try Data(contentsOf: url)
    }
    
    @Test func canDecodeCommonPlayerInfo() throws {
        let commonplayerinfo: CommonPlayerInfo = try CommonPlayerInfo(from: self.responseData)
        
        let birthdate = try Date.init("1998-03-03T00:00:00Z", strategy: .iso8601)
        
        #expect(commonplayerinfo.personId == 1628369)
        #expect(commonplayerinfo.firstName == "Jayson")
        #expect(commonplayerinfo.lastName == "Tatum")
        #expect(commonplayerinfo.displayName == "Jayson Tatum")
        #expect(commonplayerinfo.birthdate == birthdate)
        #expect(commonplayerinfo.school == "Duke")
        #expect(commonplayerinfo.country == "USA")
        #expect(commonplayerinfo.height == "6-8")
        #expect(commonplayerinfo.weight == 210)
        #expect(commonplayerinfo.seasonExp == 8)
        #expect(commonplayerinfo.jersey == "0")
        #expect(commonplayerinfo.position == "Forward-Guard")
        #expect(commonplayerinfo.rosterStatus == "Active")
        #expect(commonplayerinfo.teamId == 1610612738)
        #expect(commonplayerinfo.teamName == "Celtics")
        #expect(commonplayerinfo.teamAbbreviation == "BOS")
        #expect(commonplayerinfo.teamCity == "Boston")
        #expect(commonplayerinfo.fromYear == 2017)
        #expect(commonplayerinfo.toYear == 2025)
        #expect(commonplayerinfo.draftYear == "2017")
        #expect(commonplayerinfo.draftRound == "1")
        #expect(commonplayerinfo.draftNumber == "3")
    }
}
