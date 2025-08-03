import Foundation
import NBAKit

//class MockNbaApiService: IApiService {
//    var baseURL: URL
//    var headers: [String: String]
//    
//    private let bundles = Bundle.allBundles
//    
//    init() {
//        self.baseURL = URL(string: "http://www.example.com")!
//        self.headers = [:]
//    }
//    
//    func get<T: ResponseInitializable>(path: String, timeoutInterval timeInterval: TimeInterval, params: [URLQueryItem]?) async throws -> T {
//        let fileNameComponents = path.split(separator: ".")
//        let fileName = fileNameComponents[0]
//        let fileExtension = fileNameComponents[1]
//        
//        var url: URL?
//        for bundle in bundles {
//            if let foundURL = bundle.url(forResource: fileName.base, withExtension: fileExtension.base) {
//                url = foundURL
//                break
//            }
//        }
//        
//        guard let url else {
//            fatalError("\(path) not found in test bundle.")
//        }
//        
//        let response = try Data(contentsOf: url)
//        
//        return try JSONDecoder().decode(T.self, from: response)
//    }
//}
