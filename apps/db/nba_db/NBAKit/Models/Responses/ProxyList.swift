import Foundation

public struct ProxyList: ResponseInitializable {
    let proxies: [Proxy]

    public init(from data: Data) throws {
        let decoder = JSONDecoder()
        let resp = try decoder.decode(ProxyList.self, from: data)
        
        self.proxies = resp.proxies
    }
}

public struct Proxy: Codable {
    let id: Int
    let status: String
    let networkType: String
    let authentication: Authentication
    let connection: Connection
    let proxyType, createdAt, expiresAt: String
    let metadata: Metadata
}

struct Authentication: Codable {
    let username: String
    let password: String
}

struct Connection: Codable {
    let publicIp: String
    let connectIp: String
    let ipVersion: String
    let httpPort: Int?
    let httpsPort: Int?
    let socks5Port: Int?
}

struct Metadata: Codable {
    let ispName: String
}
