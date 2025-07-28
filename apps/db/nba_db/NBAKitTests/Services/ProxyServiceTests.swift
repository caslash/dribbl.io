import Foundation
import Testing
@testable import NBAKit

struct ProxyServiceTests {
    let proxyService: ProxyService
    let apiKey: String
    let apiSecret: String
    
    init() {
        self.proxyService = ProxyService()
        
        let bundles = Bundle.allBundles
        
        var url: URL?
        for bundle in bundles {
            if let foundURL = bundle.url(forResource: "TestConfig", withExtension: "plist") {
                url = foundURL
                break
            }
        }
        
        guard let url = url else {
            fatalError("TestConfig.plist not found in test bundle.")
        }
        
        guard let plist = NSDictionary(contentsOf: url) as? [String: String] else {
            fatalError("Could not decode TestConfig.plist")
        }
        
        self.apiKey = plist["PROXY_CHEAP_API_KEY"] ?? ""
        self.apiSecret = plist["PROXY_CHEAP_API_SECRET"] ?? ""
    }
    
    @Test func canFetchProxies() async throws {
        setenv("PROXY_CHEAP_API_KEY", self.apiKey, 1)
        setenv("PROXY_CHEAP_API_SECRET", self.apiSecret, 1)

        await self.proxyService.fetchProxies()
        
        let proxy = self.proxyService.popProxy()
        
        #expect(proxy.connection.publicIp != "")
    }
}
