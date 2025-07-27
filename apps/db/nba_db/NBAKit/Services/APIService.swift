import Foundation

public protocol IApiService {
    var baseURL: URL { get }
    var headers: [String: String] { get }
    
    init(api: ApiSource)
    
    func get<T: ResponseInitializable>(path: String?, timeoutInterval: TimeInterval, params: [URLQueryItem]?) async throws -> T
}

public enum ApiSource {
    case nba, proxies
    
    var baseURL: URL {
        switch self {
        case .nba: URL(string: "https://stats.nba.com/stats")!
        case .proxies: URL(string: "https://api.proxy-cheap.com/proxies")!
        }
    }
    
    var headers: [String: String] {
        switch self {
        case .nba: [
            "Cache-Control": "no-cache",
            "Host": "stats.nba.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.5",
            "x-nba-stats-origin": "stats",
            "x-nba-stats-token": "true",
            "Referer": "https://stats.nba.com/",
            "Pragma": "no-cache"
        ]
        case .proxies: [
            "Accept": "application/json",
            "X-Api-Key": ProcessInfo.processInfo.environment["PROXY_CHEAP_API_KEY"] ?? "",
            "X-Api-Secret": ProcessInfo.processInfo.environment["PROXY_CHEAP_API_SECRET"] ?? ""
        ]
        }
    }
}

public class APIService: IApiService {
    public static let nbaApiService: APIService = .init(api: .nba)
    public static let proxyApiService: APIService = .init(api: .proxies)
    
    public var baseURL: URL
    public var headers: [String : String]
    
    required public init(api: ApiSource) {
        self.baseURL = api.baseURL
        self.headers = api.headers
    }
    
    public func get<T: ResponseInitializable>(path: String? = nil, timeoutInterval: TimeInterval = 5, params: [URLQueryItem]? = nil) async throws -> T {
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
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        
        return try T.init(from: data)
    }
}
