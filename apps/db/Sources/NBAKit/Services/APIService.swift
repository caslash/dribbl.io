import Foundation

public protocol IApiService {
    var baseURL: URL { get }
    var headers: [String: String] { get }

    func get<T: ResponseInitializable>(
        timeoutInterval: TimeInterval,
        path: String?,
        params: [URLQueryItem]?,
        urlSession: URLSession
    ) async throws -> T
}

public enum ApiSource {
    case nba, proxies, test

    var baseURL: URL {
        switch self {
        case .nba: URL(string: "https://stats.nba.com/stats")!
        case .proxies: URL(string: "https://api.proxy-cheap.com/proxies")!
        case .test: URL(string: "https://api.myip.com")!
        }
    }

    var headers: [String: String] {
        switch self {
        case .nba:
            [
                "Cache-Control": "no-cache",
                "Host": "stats.nba.com",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.9",
                "x-nba-stats-origin": "stats",
                "x-nba-stats-token": "true",
                "Referer": "https://www.nba.com",
                "Origin": "https://www.nba.com",
                "Pragma": "no-cache",
            ]
        case .proxies:
            [
                "Accept": "application/json",
                "X-Api-Key": ProcessInfo.processInfo.environment["PROXY_CHEAP_API_KEY"] ?? "",
                "X-Api-Secret": ProcessInfo.processInfo.environment["PROXY_CHEAP_API_SECRET"] ?? "",
            ]
        default: [:]
        }
    }
}

public class APIService: IApiService {
    public static let nbaApiService: APIService = .init(api: .nba)
    public static let proxyApiService: APIService = .init(api: .proxies)
    public static let testProxyApiService: APIService = .init(api: .test)

    public var baseURL: URL
    public var headers: [String: String]

    public static func session(proxy: Proxy? = nil) -> URLSession {
        let config = URLSessionConfiguration.ephemeral

        if let proxy {
            guard let httpPort = proxy.connection.httpPort else {
                fatalError("Proxy httpPort is required but was nil")
            }

            guard
                let authHeader = createBasicAuthHeader(
                    username: proxy.authentication.username, password: proxy.authentication.password
                )
            else {
                fatalError("Could not create auth header for \(proxy.authentication.username)")
            }

            config.connectionProxyDictionary = [
                kCFNetworkProxiesHTTPEnable: true,
                kCFNetworkProxiesHTTPProxy: proxy.connection.publicIp,
                kCFNetworkProxiesHTTPPort: httpPort,
                kCFNetworkProxiesHTTPSEnable: true,
                kCFNetworkProxiesHTTPSProxy: proxy.connection.publicIp,
                kCFNetworkProxiesHTTPSPort: httpPort,
            ]

            config.httpAdditionalHeaders = ["Proxy-Authorization": authHeader]

            return URLSession(configuration: config)
        } else {
            return URLSession(configuration: config)
        }
    }

    private static func createBasicAuthHeader(username: String, password: String) -> String? {
        let loginString = "\(username):\(password)"
        guard let loginData = loginString.data(using: .utf8) else { return nil }
        let base64LoginString = loginData.base64EncodedString()
        return "Basic \(base64LoginString)"
    }

    private init(api: ApiSource) {
        self.baseURL = api.baseURL
        self.headers = api.headers
    }

    public func get<T: ResponseInitializable>(
        timeoutInterval: TimeInterval = 5,
        path: String? = nil,
        params: [URLQueryItem]? = nil,
        urlSession: URLSession
    ) async throws -> T {
        var url: URL = baseURL

        if let path {
            url = url.appending(path: path)
        }

        if let params {
            url = url.appending(queryItems: params)
        }

        var request: URLRequest = URLRequest(url: url, timeoutInterval: timeoutInterval)

        request.httpMethod = "GET"
        for header in headers {
            request.addValue(header.value, forHTTPHeaderField: header.key)
        }

        let (data, response) = try await urlSession.data(for: request)

        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }

        return try T.init(from: data)
    }
}
