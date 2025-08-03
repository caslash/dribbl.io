import Foundation
import Testing
@testable import NBAKit

struct APIServiceTests {
    let apiKey: String
    let apiSecret: String
    
    init() {
        guard let url = Bundle.module.url(forResource: "TestConfig", withExtension: "plist") else {
            fatalError("TestConfig.plist not found in test bundle.")
        }
        
        guard let plist = NSDictionary(contentsOf: url) as? [String: String] else {
            fatalError("Could not decode TestConfig.plist")
        }
        
        self.apiKey = plist["PROXY_CHEAP_API_KEY"] ?? ""
        self.apiSecret = plist["PROXY_CHEAP_API_SECRET"] ?? ""
    }
    
    @Test func canFetchCommonPlayerInfo() async throws {
        let apiService = APIService.nbaApiService
        
        let commonplayerinfo: CommonPlayerInfo = try await apiService.fetchWithRetry(endpoint: .commonPlayerInfo, playerId: 1628369)
        
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
    }
    
    @Test func canFetchCommonPlayerInfoWithProxy() async throws {
        let apiService = APIService.nbaApiService
        
        let proxyList = try getTestProxies()
        
        let commonplayerinfo: CommonPlayerInfo = try await apiService.fetchWithRetry(endpoint: .commonPlayerInfo, playerId: 1628369, proxy: proxyList.proxies.randomElement())
        
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
    }
    
    @Test func canFetchPlayerAwards() async throws {
        let apiService = APIService.nbaApiService
        
        let playerawardslist: PlayerAwardsList = try await apiService.fetchWithRetry(endpoint: .playerAwards, playerId: 1628369)
        
        #expect(playerawardslist.PlayerAwards.count == 34)
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
    
    @Test func canFetchPlayerAwardsWithProxy() async throws {
        let apiService = APIService.nbaApiService
        
        let proxyList = try getTestProxies()

        let playerawardslist: PlayerAwardsList = try await apiService.fetchWithRetry(endpoint: .playerAwards, playerId: 1628369, proxy: proxyList.proxies.randomElement())
        
        #expect(playerawardslist.PlayerAwards.count == 34)
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
    
    @Test func canFetchPlayerProfile() async throws {
        let apiService = APIService.nbaApiService
        
        let playerprofilev2: PlayerProfileV2 = try await apiService.fetchWithRetry(endpoint: .playerProfileV2, playerId: 1628369)
        
        #expect(playerprofilev2.regularSeasonTotals.count >= 1)
        #expect(type(of: playerprofilev2.careerRegularSeasonTotals) == CareerTotalsRegularSeason.self)
        #expect(playerprofilev2.postSeasonTotals.count >= 1)
        #expect(type(of: playerprofilev2.careerPostSeasonTotals) == CareerTotalsPostSeason.self)
        #expect(playerprofilev2.allStarSeasonTotals.count >= 1)
        #expect(type(of: playerprofilev2.careerAllStarTotals) == CareerTotalsAllStarSeason.self)
        #expect(playerprofilev2.collegeSeasonTotals.count >= 1)
        #expect(type(of: playerprofilev2.careerCollegeTotals) == CareerTotalsCollegeSeason.self)
        #expect(playerprofilev2.preseasonTotals.count >= 1)
        #expect(type(of: playerprofilev2.careerPreseasonTotals) == CareerTotalsPreseason.self)
        #expect(playerprofilev2.regularSeasonRankings.count >= 1)
        #expect(playerprofilev2.postSeasonRankings.count >= 1)
    }
    
    @Test func canFetchPlayerProfileWithProxy() async throws {
        let apiService = APIService.nbaApiService
        
        let proxyList = try getTestProxies()
        
        let playerprofilev2: PlayerProfileV2 = try await apiService.fetchWithRetry(endpoint: .playerProfileV2, playerId: 1628369, proxy: proxyList.proxies.randomElement())
        
        #expect(playerprofilev2.regularSeasonTotals.count >= 1)
        #expect(type(of: playerprofilev2.careerRegularSeasonTotals) == CareerTotalsRegularSeason.self)
        #expect(playerprofilev2.postSeasonTotals.count >= 1)
        #expect(type(of: playerprofilev2.careerPostSeasonTotals) == CareerTotalsPostSeason.self)
        #expect(playerprofilev2.allStarSeasonTotals.count >= 1)
        #expect(type(of: playerprofilev2.careerAllStarTotals) == CareerTotalsAllStarSeason.self)
        #expect(playerprofilev2.collegeSeasonTotals.count >= 1)
        #expect(type(of: playerprofilev2.careerCollegeTotals) == CareerTotalsCollegeSeason.self)
        #expect(playerprofilev2.preseasonTotals.count >= 1)
        #expect(type(of: playerprofilev2.careerPreseasonTotals) == CareerTotalsPreseason.self)
        #expect(playerprofilev2.regularSeasonRankings.count >= 1)
        #expect(playerprofilev2.postSeasonRankings.count >= 1)
    }
    
    @Test func canFetchProxies() async throws {
        setenv("PROXY_CHEAP_API_KEY", self.apiKey, 1)
        setenv("PROXY_CHEAP_API_SECRET", self.apiSecret, 1)
        
        let apiService = APIService.proxyApiService
        
        let proxylist: ProxyList = try await apiService.get()
        
        #expect(proxylist.proxies.count == 10)
    }
    
    private func getTestProxies() throws -> ProxyList {
        guard let url = Bundle.module.url(forResource: "proxylist", withExtension: "json") else {
            fatalError("proxylist.json not found in test bundle.")
        }
        
        guard let proxyData = try? Data(contentsOf: url) else {
            fatalError("Error decoding proxylist.json")
        }
        
        guard let proxyList = try? ProxyList(from: proxyData) else {
            fatalError("Error initiating ProxyList")
        }
        
        return proxyList
    }
}
