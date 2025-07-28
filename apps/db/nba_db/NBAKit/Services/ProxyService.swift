import Foundation

public class ProxyService {
    private var proxies: Set<Proxy> = Set()
    
    public init() {}
    
    public func fetchProxies() async {
        let apiService = APIService.proxyApiService
        
        let proxyList: ProxyList? = try? await apiService.get()
        
        guard let proxies = proxyList?.proxies else {
            fatalError("Could not fetch list of proxies")
        }
        
        for proxy in proxies {
            if ((try? await self.testProxy(proxy)) != nil) {
                self.proxies.insert(proxy)
            }
        }
    }
    
    public func popProxy() -> Proxy {
        return proxies.removeFirst()
    }
    
    public func replaceProxy(_ proxy: Proxy) {
        self.proxies.insert(proxy)
    }
    
    private func testProxy(_ proxy: Proxy) async throws -> Bool {
        let apiService = APIService.testProxyApiService
        
        let result: ProxyResult = try await apiService.get(proxy: proxy)
        
        return result.ip == proxy.connection.publicIp
    }
    
    private struct ProxyResult: ResponseInitializable {
        let ip: String
        let country: String
        
        init(from data: Data) throws {
            let decoder = JSONDecoder()
            self = try decoder.decode(ProxyResult.self, from: data)
        }
    }
}
