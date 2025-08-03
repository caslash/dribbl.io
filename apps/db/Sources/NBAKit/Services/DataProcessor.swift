import Foundation

public final class DataProcessor {
    private let nbaApiService: APIService
    private let proxyApiService: APIService
    private let proxyPool: ProxyPool
    private let databaseService: DatabaseService
    
    private let maxConcurrency: Int
    private let batchSize: Int

    private var progressTracker: ProgressTracker
    
    public init(maxConcurrency: Int = 10, batchSize: Int = 50, databaseConfig: DatabaseConfig) throws {
        self.nbaApiService = APIService.nbaApiService
        self.proxyApiService = APIService.proxyApiService
        self.proxyPool = ProxyPool(maxConcurrentPerProxy: 1)
        self.databaseService = try DatabaseService(config: databaseConfig)
        
        self.maxConcurrency = maxConcurrency
        self.batchSize = batchSize
        
        self.progressTracker = ProgressTracker(total: 0)
    }
    
    public func processPlayers(_ players: [PlayerInfo]) async throws -> ProcessingSummary {
        try await self.initializeProxyPool()
        let totalCount = players.count
        self.progressTracker = ProgressTracker(total: totalCount)
        
        let batches = players.chunked(into: self.batchSize)
        
        var finalSummary: ProcessingSummary!
        finalSummary = try await withThrowingTaskGroup(
            of: ProcessingSummary.self,
            returning: ProcessingSummary.self
        ) { group in
            for batch in batches {
                group.addTask { [self] in
                    let result = await self.processBatch(batch)
                    try await self.handleBatchResult(result)
                    return await self.progressTracker.getFinalSummary()
                }
            }
            
            var last: ProcessingSummary = ProcessingSummary(
                totalPlayers: totalCount,
                completed: 0,
                failed: 0,
                errors: [:],
                totalTime: 0,
                averageRate: 0
            )
            for try await summary in group {
                last = summary
            }
            return last
        }
        
        return finalSummary
    }
    
    private func initializeProxyPool() async throws {
        let proxiesList: ProxyList = try await self.proxyApiService.get()
        await self.proxyPool.initialize(with: proxiesList.proxies)
    }
    
    private func processBatch(_ players: [PlayerInfo]) async -> (players: [Player], accolades: [PlayerAccolades]) {
        // Process players concurrently within the batch, respecting maxConcurrency
        let results = await withTaskGroup(of: (Player?, PlayerAccolades?).self) { group in
            var results: [(Player?, PlayerAccolades?)] = []
            
            for info in players {
                group.addTask { [self] in
                    do {
                        let (player, accolade) = try await self.processPlayer(info)
                        await self.progressTracker.updateProgress()
                        return (player, accolade)
                    } catch {
                        await self.progressTracker.recordError(playerId: info.id, error: error)
                        return (nil, nil)
                    }
                }
            }
            
            for await result in group {
                results.append(result)
            }
            
            return results
        }
        
        let processedPlayers = results.compactMap { $0.0 }
        let processedAccolades = results.compactMap { $0.1 }
        
        return (players: processedPlayers, accolades: processedAccolades)
    }
    
    private func processPlayer(_ playerInfo: PlayerInfo) async throws -> (Player, PlayerAccolades) {
        let proxy = await self.proxyPool.acquireProxy()
        
        do {
            let cpi: CommonPlayerInfo = try await self.nbaApiService.fetchWithRetry(endpoint: .commonPlayerInfo, playerId: playerInfo.id, proxy: proxy)
            
            let profile: PlayerProfileV2 = try await self.nbaApiService.fetchWithRetry(endpoint: .playerProfileV2, playerId: playerInfo.id, proxy: proxy)
            
            let awards: PlayerAwardsList = try await self.nbaApiService.fetchWithRetry(endpoint: .playerAwards, playerId: playerInfo.id, proxy: proxy)
            
            var player = Player(id: playerInfo.id, first_name: cpi.firstName, last_name: cpi.lastName)
            
            self.fillOutPlayer(&player, cpi: cpi, profile: profile)
            
            let accolades = PlayerAccolades(player_id: playerInfo.id, accolades: awards)
            
            // Release proxy before returning
            if let proxy = proxy {
                await self.proxyPool.releaseProxy(proxy)
            }
            
            return (player, accolades)
        } catch {
            // Release proxy on error
            if let proxy = proxy {
                await self.proxyPool.releaseProxy(proxy)
            }
            throw error
        }
    }
    
    private func fillOutPlayer(_ player: inout Player, cpi: CommonPlayerInfo, profile: PlayerProfileV2) {
        player.birthdate = cpi.birthdate
        player.school = cpi.school
        player.country = cpi.country
        player.height = cpi.height
        player.weight = cpi.weight
        player.season_exp = cpi.seasonExp
        player.jersey = Int(from: cpi.jersey) ?? nil
        player.position = cpi.position
        player.team_history = self.getPlayerTeamHistory(regularSeasonTotals: profile.regularSeasonTotals)
        player.is_active = cpi.rosterStatus == "Active"
        player.from_year = cpi.fromYear
        player.to_year = cpi.toYear
        player.total_games_played = self.getPlayerGamesPlayed(regularSeasonTotals: profile.regularSeasonTotals)
        player.draft_year = cpi.draftYear
        player.draft_round = cpi.draftRound
        player.draft_number = cpi.draftNumber
        
        let averages: (ppg: Double, rpg: Double, apg: Double) = self.getPlayerCareerAverages(careerRegularSeasonTotals: profile.careerRegularSeasonTotals)
        
        player.career_ppg = averages.ppg
        player.career_rpg = averages.rpg
        player.career_apg = averages.apg
    }
    
    private func getPlayerTeamHistory(regularSeasonTotals: [SeasonTotalsRegularSeason]) -> String {
        let filteredSeasons = regularSeasonTotals.filter { $0.teamId != 0 }
        let onlyNBASeasons = filteredSeasons.filter { $0.leagueId == "00" }
        let uniqueTeamIds = onlyNBASeasons.map { $0.teamId }.unique().map { String($0) }
        return uniqueTeamIds.joined(separator: ",")
    }
    
    private func getPlayerGamesPlayed(regularSeasonTotals: [SeasonTotalsRegularSeason]) -> Int {
        let filteredSeasons = regularSeasonTotals.filter { $0.teamId != 0 }
        let onlyNBASeasons = filteredSeasons.filter { $0.leagueId == "00" }
        return onlyNBASeasons.map { $0.gamesPlayed }.reduce(0) { (runningTotal, next) in
            runningTotal + next
        }
    }
    
    private func getPlayerCareerAverages(careerRegularSeasonTotals: CareerTotalsRegularSeason?) -> (ppg: Double, rpg: Double, apg: Double) {
        guard let careerRegularSeasonTotals else {
            return (0.0, 0.0, 0.0)
        }
        
        return (
            careerRegularSeasonTotals.points,
            careerRegularSeasonTotals.rebounds,
            careerRegularSeasonTotals.assists
        )
    }
    
    private func handleBatchResult(_ result: (players: [Player], accolades: [PlayerAccolades])) async throws {
        try await databaseService.batchInsertPlayers(result.players)
        try await databaseService.batchInsertPlayerAccolades(result.accolades)
    }
}
