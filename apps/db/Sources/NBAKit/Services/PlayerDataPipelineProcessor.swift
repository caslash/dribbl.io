import AsyncAlgorithms
import Foundation

public final class PlayerDataPipelineProcessor {
    private let fetchConcurrency: Int
    private let processConcurrency: Int
    private let batchSize: Int

    private let nbaApiService: APIService
    private let proxyPool: ProxyPool
    private let databaseService: DatabaseService

    // Pipeline channels
    private let fetchQueue: AsyncChannel<PlayerInfo>
    private let processQueue: AsyncChannel<FetchResult>
    private let databaseQueue: AsyncChannel<ProcessResult>

    // Pipeline tasks
    private var fetchTasks: [Task<Void, Never>] = []
    private var processTasks: [Task<Void, Never>] = []
    private var databaseTask: Task<Void, Never>?

    // Completion tracking
    private var isShutdown = false

    // Pipeline result structures
    public struct FetchResult {
        let playerInfo: PlayerInfo
        let cpi: CommonPlayerInfo
        let profile: PlayerProfileV2
        let awards: PlayerAwardsList
    }

    public struct ProcessResult {
        let player: Player
        let accolades: PlayerAccolades
    }

    // Error and completion handlers
    public var onFetchError: ((PlayerInfo, Error) async -> Void)?
    public var onProcessError: ((FetchResult, Error) async -> Void)?
    public var onDatabaseError: ((Error) async -> Void)?
    public var onProgressUpdate: (() async throws -> Void)?

    public init(
        fetchConcurrency: Int = 20,
        processConcurrency: Int = 10,
        batchSize: Int = 100,
        nbaApiService: APIService,
        proxyPool: ProxyPool,
        databaseService: DatabaseService
    ) {
        self.fetchConcurrency = fetchConcurrency
        self.processConcurrency = processConcurrency
        self.batchSize = batchSize

        self.nbaApiService = nbaApiService
        self.proxyPool = proxyPool
        self.databaseService = databaseService

        // Initialize pipeline channels
        self.fetchQueue = AsyncChannel<PlayerInfo>()
        self.processQueue = AsyncChannel<FetchResult>()
        self.databaseQueue = AsyncChannel<ProcessResult>()

        self.startPipelines()
    }

    // MARK: - Public Interface

    public func process(_ playerInfo: PlayerInfo) async {
        guard !isShutdown else { return }
        await fetchQueue.send(playerInfo)
    }

    public func finishInput() {
        fetchQueue.finish()
    }

    public func waitForCompletion() async {
        // Wait for fetch tasks
        for task in fetchTasks {
            await task.value
        }

        // Signal process completion
        processQueue.finish()

        // Wait for process tasks
        for task in processTasks {
            await task.value
        }

        // Signal database completion
        databaseQueue.finish()

        // Wait for database task
        await databaseTask?.value
    }

    public func shutdown() async {
        isShutdown = true

        fetchQueue.finish()
        processQueue.finish()
        databaseQueue.finish()

        for task in fetchTasks {
            task.cancel()
            await task.value
        }

        for task in processTasks {
            task.cancel()
            await task.value
        }

        databaseTask?.cancel()
        await databaseTask?.value
    }

    // MARK: - Pipeline Setup

    private func startPipelines() {
        startFetchPipeline()
        startProcessPipeline()
        startDatabasePipeline()
    }

    private func startFetchPipeline() {
        for _ in 0..<fetchConcurrency {
            let task = Task {
                await self.runFetchPipeline()
            }
            fetchTasks.append(task)
        }
    }

    private func startProcessPipeline() {
        for _ in 0..<processConcurrency {
            let task = Task {
                await self.runProcessPipeline()
            }
            processTasks.append(task)
        }
    }

    private func startDatabasePipeline() {
        databaseTask = Task {
            await self.runDatabasePipeline()
        }
    }

    // MARK: - Pipeline Implementations

    private func runFetchPipeline() async {
        do {
            for try await playerInfo in fetchQueue {
                try await self.processFetch(playerInfo)
            }
        } catch {
            print("Fetch pipeline error: \(error)")
        }
    }

    private func runProcessPipeline() async {
        do {
            for try await fetchResult in processQueue {
                try await self.processData(fetchResult)
            }
        } catch {
            print("Process pipeline error: \(error)")
        }
    }

    private func runDatabasePipeline() async {
        var batch: [ProcessResult] = []

        do {
            for try await processResult in databaseQueue {
                batch.append(processResult)

                if batch.count >= batchSize {
                    try await self.writeBatch(batch)
                    batch.removeAll()
                }
            }

            // Write remaining batch
            if !batch.isEmpty {
                try await self.writeBatch(batch)
            }

        } catch {
            await onDatabaseError?(error)
        }
    }

    // MARK: - Pipeline Stage Processors

    private func processFetch(_ playerInfo: PlayerInfo) async throws {
        do {
            let fetchResult = try await self.fetchPlayerData(playerInfo)
            await processQueue.send(fetchResult)
        } catch {
            await onFetchError?(playerInfo, error)
            throw error
        }
    }

    private func processData(_ fetchResult: FetchResult) async throws {
        do {
            let processResult = self.transformPlayerData(fetchResult)
            await databaseQueue.send(processResult)
            try await onProgressUpdate?()
        } catch {
            await onProcessError?(fetchResult, error)
            throw error
        }
    }

    private func writeBatch(_ batch: [ProcessResult]) async throws {
        let players = batch.map { $0.player }
        let accolades = batch.map { $0.accolades }

        do {
            try await databaseService.batchInsertPlayers(players)
            try await databaseService.batchInsertPlayerAccolades(accolades)
        } catch {
            await onDatabaseError?(error)
            throw error
        }
    }

    // MARK: - Data Processing Logic

    private func fetchPlayerData(_ playerInfo: PlayerInfo) async throws -> FetchResult {
        let proxy = await self.proxyPool.acquireProxy()
        let urlSession = APIService.session(proxy: proxy)

        do {
            async let cpi: CommonPlayerInfo = self.nbaApiService.fetchWithRetry(
                endpoint: .commonPlayerInfo,
                playerId: playerInfo.id,
                urlSession: urlSession
            )
            async let profile: PlayerProfileV2 = self.nbaApiService.fetchWithRetry(
                endpoint: .playerProfileV2,
                playerId: playerInfo.id,
                urlSession: urlSession
            )
            async let awards: PlayerAwardsList = self.nbaApiService.fetchWithRetry(
                endpoint: .playerAwards,
                playerId: playerInfo.id,
                urlSession: urlSession
            )

            let (cpiResult, profileResult, awardsResult) = try await (cpi, profile, awards)

            if let proxy {
                await self.proxyPool.releaseProxy(proxy)
            }

            return FetchResult(
                playerInfo: playerInfo,
                cpi: cpiResult,
                profile: profileResult,
                awards: awardsResult
            )
        } catch {
            if let proxy {
                await self.proxyPool.releaseProxy(proxy)
            }
            throw error
        }
    }

    private func transformPlayerData(_ fetchResult: FetchResult) -> ProcessResult {
        var player = Player(
            id: fetchResult.playerInfo.id,
            first_name: fetchResult.cpi.firstName,
            last_name: fetchResult.cpi.lastName
        )

        PlayerDataTransformer.fillOutPlayer(
            &player, cpi: fetchResult.cpi, profile: fetchResult.profile)

        let accolades = PlayerAccolades(
            player_id: fetchResult.playerInfo.id,
            accolades: fetchResult.awards
        )

        return ProcessResult(player: player, accolades: accolades)
    }
}
