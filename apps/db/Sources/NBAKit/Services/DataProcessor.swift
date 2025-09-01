import AsyncAlgorithms
import Foundation

public final class DataProcessor {
    private let proxyApiService: APIService
    private let databaseService: DatabaseService
    private let pipelineProcessor: PlayerDataPipelineProcessor
    private let proxyPool: ProxyPool

    private var progressTracker: ProgressTracker

    public init(
        fetchConcurrency: Int = 20,
        processConcurrency: Int = 10,
        batchSize: Int = 100,
        databaseConfig: DatabaseConfig
    ) throws {
        self.proxyApiService = APIService.proxyApiService
        self.databaseService = try DatabaseService(config: databaseConfig)
        self.proxyPool = ProxyPool(maxConcurrentPerProxy: 3)

        self.pipelineProcessor = PlayerDataPipelineProcessor(
            fetchConcurrency: fetchConcurrency,
            processConcurrency: processConcurrency,
            batchSize: batchSize,
            nbaApiService: APIService.nbaApiService,
            proxyPool: proxyPool,
            databaseService: databaseService
        )

        self.progressTracker = ProgressTracker(total: 0)

        self.setupPipelineErrorHandlers()
    }

    public func processPlayers(_ players: [PlayerInfo]) async throws -> ProcessingSummary {
        // Initialize proxy pool
        try await self.initializeProxyPool()

        // Set up progress tracking
        let totalCount = players.count
        self.progressTracker = ProgressTracker(total: totalCount)

        do {
            // Process players through the pipeline
            for player in players {
                await pipelineProcessor.process(player)
            }

            // Signal completion and wait for all processing to finish
            pipelineProcessor.finishInput()
            await pipelineProcessor.waitForCompletion()

            // Close database connection
            try await databaseService.close()

            return await progressTracker.getFinalSummary()

        } catch {
            // Cleanup on error
            await pipelineProcessor.shutdown()
            try await databaseService.close()
            throw error
        }
    }

    private func setupPipelineErrorHandlers() {
        pipelineProcessor.onFetchError = { [weak self] playerInfo, error in
            await self?.progressTracker.recordError(playerId: playerInfo.id, error: error)
        }

        pipelineProcessor.onProcessError = { [weak self] fetchResult, error in
            await self?.progressTracker.recordError(
                playerId: fetchResult.playerInfo.id, error: error)
        }

        pipelineProcessor.onDatabaseError = { error in
            print("Database pipeline error: \(error)")
        }

        pipelineProcessor.onProgressUpdate = { [weak self] in
            await self?.progressTracker.updateProgress()
        }
    }

    private func initializeProxyPool() async throws {
        let urlSession = APIService.session()
        let proxiesList: ProxyList = try await self.proxyApiService.get(urlSession: urlSession)
        await self.proxyPool.initialize(with: proxiesList.proxies)
    }

    deinit {
        Task { [pipelineProcessor] in
            await pipelineProcessor.shutdown()
        }
    }
}
