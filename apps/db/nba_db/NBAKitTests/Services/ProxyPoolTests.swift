import Foundation
import Testing
@testable import NBAKit

struct ProxyPoolTests {
    let apiKey: String
    let apiSecret: String
    
    init() {
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
    
    private func createMockProxy(id: Int, publicIp: String) -> Proxy {
        return Proxy(
            id: id,
            status: "active",
            networkType: "residential",
            authentication: Authentication(username: "user", password: "pass"),
            connection: Connection(
                publicIp: publicIp,
                connectIp: publicIp,
                ipVersion: "ipv4",
                httpPort: 8080,
                httpsPort: 8443,
                socks5Port: 1080
            ),
            proxyType: "http",
            createdAt: "2024-01-01",
            expiresAt: "2024-12-31",
            metadata: Metadata(ispName: "Test ISP")
        )
    }
    
    @Test func proxyPoolCanBeInitialized() async throws {
        let proxyPool = ProxyPool()
        #expect(proxyPool != nil)
    }
    
    @Test func proxyPoolInitializesWithCustomMaxConcurrentValue() async throws {
        let proxyPool = ProxyPool(maxConcurrentPerProxy: 5)
        #expect(proxyPool != nil)
    }
    
    @Test func initializeWithEmptyProxyListCompletes() async throws {
        let proxyPool = ProxyPool()
        await proxyPool.initialize(with: [])
        
        let acquiredProxy = await proxyPool.acquireProxy()
        #expect(acquiredProxy == nil)
    }
    
    @Test func acquireProxyReturnsNilWhenPoolEmpty() async throws {
        let proxyPool = ProxyPool()
        await proxyPool.initialize(with: [])
        
        let acquiredProxy = await proxyPool.acquireProxy()
        #expect(acquiredProxy == nil)
    }
    
    @Test func initializeFiltersInvalidProxies() async throws {
        let proxyPool = ProxyPool()
        
        let invalidProxies = [
            createMockProxy(id: 1, publicIp: "127.0.0.1"),
            createMockProxy(id: 2, publicIp: "192.168.1.1"),
            createMockProxy(id: 3, publicIp: "10.0.0.1")
        ]
        
        await proxyPool.initialize(with: invalidProxies)
        
        let acquiredProxy = await proxyPool.acquireProxy()
        #expect(acquiredProxy == nil)
    }
    
    @Test func proxyEqualityWorks() async throws {
        let proxy1 = createMockProxy(id: 1, publicIp: "1.1.1.1")
        let proxy2 = createMockProxy(id: 1, publicIp: "1.1.1.1")
        let proxy3 = createMockProxy(id: 2, publicIp: "2.2.2.2")
        
        #expect(proxy1 == proxy2)
        #expect(proxy1 != proxy3)
        
        var hasher1 = Hasher()
        proxy1.hash(into: &hasher1)
        let hash1 = hasher1.finalize()
        
        var hasher2 = Hasher()
        proxy2.hash(into: &hasher2)
        let hash2 = hasher2.finalize()
        
        var hasher3 = Hasher()
        proxy3.hash(into: &hasher3)
        let hash3 = hasher3.finalize()
        
        #expect(hash1 == hash2)
        #expect(hash1 != hash3)
    }
    
    @Test func proxyPoolHandlesNoValidProxiesGracefully() async throws {
        let proxyPool = ProxyPool()
        
        let badProxies = [
            createMockProxy(id: 1, publicIp: "256.256.256.256"),
            createMockProxy(id: 2, publicIp: "invalid.ip.address"),
            createMockProxy(id: 3, publicIp: "")
        ]
        
        await proxyPool.initialize(with: badProxies)
        
        let acquiredProxy = await proxyPool.acquireProxy()
        #expect(acquiredProxy == nil)
    }
    
    @Test func proxyStructureHasRequiredFields() async throws {
        let proxy = createMockProxy(id: 123, publicIp: "1.2.3.4")
        
        #expect(proxy.id == 123)
        #expect(proxy.status == "active")
        #expect(proxy.networkType == "residential")
        #expect(proxy.authentication.username == "user")
        #expect(proxy.authentication.password == "pass")
        #expect(proxy.connection.publicIp == "1.2.3.4")
        #expect(proxy.connection.connectIp == "1.2.3.4")
        #expect(proxy.connection.httpPort == 8080)
        #expect(proxy.connection.httpsPort == 8443)
        #expect(proxy.connection.socks5Port == 1080)
        #expect(proxy.proxyType == "http")
        #expect(proxy.metadata.ispName == "Test ISP")
    }
    
    @Test func proxyPoolActorCanHandleConcurrentAccesses() async throws {
        let proxyPool = ProxyPool()
        
        await withTaskGroup(of: Void.self) { group in
            for _ in 1...10 {
                group.addTask {
                    await proxyPool.initialize(with: [])
                    let _ = await proxyPool.acquireProxy()
                }
            }
        }
        
        let finalProxy = await proxyPool.acquireProxy()
        #expect(finalProxy == nil)
    }
    
    @Test func initializeReplacesExistingProxies() async throws {
        let proxyPool = ProxyPool()
        
        await proxyPool.initialize(with: [])
        let firstResult = await proxyPool.acquireProxy()
        #expect(firstResult == nil)
        
        await proxyPool.initialize(with: [])
        let secondResult = await proxyPool.acquireProxy()
        #expect(secondResult == nil)
    }
}