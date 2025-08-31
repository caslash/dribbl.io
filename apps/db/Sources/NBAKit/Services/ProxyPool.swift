import Foundation

public actor ProxyPool {
    private var availableProxies: [Proxy] = []
    private var inUseProxies: [String: Proxy] = [:]
    private let maxConcurrentPerProxy: Int
    private var proxyCurrentUsage: [String: Int] = [:]

    public init(maxConcurrentPerProxy: Int = 1) {
        self.maxConcurrentPerProxy = maxConcurrentPerProxy
    }

    public func initialize(with proxies: [Proxy]) async {
        let testedProxies = await withTaskGroup(of: Proxy?.self) { group in
            for proxy in proxies {
                group.addTask {
                    await self.testProxy(proxy)
                }
            }

            var validProxies: [Proxy] = []
            for await result in group {
                if let proxy = result {
                    validProxies.append(proxy)
                }
            }
            return validProxies
        }

        self.availableProxies = testedProxies
        print("ProxyPool initialized with \(testedProxies.count) valid proxies")
    }

    public func acquireProxy() async -> Proxy? {
        while self.availableProxies.isEmpty {
            await Task.yield()
        }

        let proxy = self.availableProxies.removeFirst()
        self.inUseProxies[proxy.connection.publicIp] = proxy
        return proxy
    }

    public func releaseProxy(_ proxy: Proxy) async {
        let proxyId = proxy.connection.publicIp
        self.inUseProxies.removeValue(forKey: proxyId)
        self.availableProxies.append(proxy)
    }

    private func testProxy(_ proxy: Proxy) async -> Proxy? {
        let apiService = APIService.testProxyApiService
        let urlSession = APIService.session(proxy: proxy)

        do {
            let result: ProxyResult = try await apiService.get(urlSession: urlSession)
            return result.ip == proxy.connection.publicIp ? proxy : nil
        } catch {
            print("Proxy test failed for \(proxy.connection.publicIp): \(error)")
            return nil
        }
    }
}

private struct ProxyResult: ResponseInitializable {
    let ip: String
    let country: String

    init(from data: Data) throws {
        let decoder = JSONDecoder()
        self = try decoder.decode(ProxyResult.self, from: data)
    }
}
