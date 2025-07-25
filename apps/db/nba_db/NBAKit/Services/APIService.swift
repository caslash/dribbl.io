protocol IApiService {
    var headers: [String: String] { get }
    
    func getCommonPlayerInfo(playerId: Int) async throws -> CommonPlayerInfo
}
