# NBA CLI Multithreading Enhancements

## Overview

This document outlines the key enhancements needed to optimize the NBA CLI for processing 5,100+ players across 10 proxies using Swift's modern concurrency features. The current services provide a solid foundation but require coordination and concurrency improvements for efficient multithreaded processing.

## Current State Analysis

- **Total Processing Load**: 5,100 players × 3 endpoints = 15,300 API requests
- **Available Resources**: 10 proxies for load distribution
- **Target Performance**: ~10-20 requests/second with proper rate limiting
- **Estimated Processing Time**: 13-26 minutes depending on approach

---

## Enhancement 1: ProxyPool Actor

### Problem
The current `ProxyService` has several issues for concurrent processing:
- Sequential proxy testing limits initialization speed
- `popProxy()` permanently removes proxies instead of rotating them
- No thread-safe management for concurrent access across multiple tasks

### Solution
Create a thread-safe actor-based proxy pool that manages proxy distribution and rotation across concurrent tasks.

### Implementation

```swift
// File: NBAKit/Services/ProxyPool.swift
import Foundation

public actor ProxyPool {
    private var availableProxies: [Proxy] = []
    private var inUseProxies: [String: Proxy] = [:]
    private let maxConcurrentPerProxy: Int
    private var proxyUsageCount: [String: Int] = [:]
    
    public init(maxConcurrentPerProxy: Int = 1) {
        self.maxConcurrentPerProxy = maxConcurrentPerProxy
    }
    
    /// Initialize the pool with tested proxies
    public func initialize(with proxies: [Proxy]) async {
        // Test proxies concurrently instead of sequentially
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
    
    /// Get an available proxy for use
    public func acquireProxy() async -> Proxy? {
        guard !availableProxies.isEmpty else { 
            print("Warning: No available proxies in pool")
            return nil 
        }
        
        // Round-robin selection for even distribution
        let proxy = availableProxies.removeFirst()
        let proxyId = proxy.connection.publicIp
        
        inUseProxies[proxyId] = proxy
        proxyUsageCount[proxyId, default: 0] += 1
        
        return proxy
    }
    
    /// Return a proxy back to the available pool
    public func releaseProxy(_ proxy: Proxy) async {
        let proxyId = proxy.connection.publicIp
        inUseProxies.removeValue(forKey: proxyId)
        availableProxies.append(proxy)
    }
    
    /// Get proxy usage statistics
    public func getStats() async -> (available: Int, inUse: Int, totalUsage: [String: Int]) {
        return (availableProxies.count, inUseProxies.count, proxyUsageCount)
    }
    
    private func testProxy(_ proxy: Proxy) async -> Proxy? {
        let apiService = APIService.testProxyApiService
        
        do {
            let result: ProxyResult = try await apiService.get(proxy: proxy)
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
```

### Integration Points
- Replace `ProxyService` usage in processing logic
- Initialize once at startup with all available proxies
- Use `acquireProxy()`/`releaseProxy()` pattern in batch processors

---

## Enhancement 2: Enhanced APIService with Retry Logic

### Problem
The current `APIService` lacks resilience for high-volume processing:
- No retry mechanism for failed requests
- Fixed timeout values don't account for different endpoint complexities
- No adaptive backoff for rate limiting scenarios

### Solution
Add comprehensive retry logic with exponential backoff and endpoint-specific configurations.

### Implementation

```swift
// File: NBAKit/Services/APIService+Retry.swift
import Foundation

public enum NBAEndpoint {
    case commonPlayerInfo
    case playerAwards
    case playerProfileV2
    
    var path: String {
        switch self {
        case .commonPlayerInfo: return "commonplayerinfo"
        case .playerAwards: return "playerawards"
        case .playerProfileV2: return "playerprofilev2"
        }
    }
    
    var timeout: TimeInterval {
        switch self {
        case .commonPlayerInfo: return 10
        case .playerAwards: return 15
        case .playerProfileV2: return 20  // Most complex endpoint
        }
    }
    
    func params(playerId: Int) -> [URLQueryItem] {
        switch self {
        case .commonPlayerInfo:
            return [
                URLQueryItem(name: "LeagueID", value: "00"),
                URLQueryItem(name: "PlayerID", value: String(playerId))
            ]
        case .playerAwards:
            return [
                URLQueryItem(name: "PlayerID", value: String(playerId))
            ]
        case .playerProfileV2:
            return [
                URLQueryItem(name: "PerMode", value: "PerGame"),
                URLQueryItem(name: "PlayerID", value: String(playerId)),
                URLQueryItem(name: "LeagueID", value: "00")
            ]
        }
    }
}

public enum APIError: Error {
    case maxRetriesExceeded
    case rateLimited
    case proxyFailure
    case invalidResponse
}

extension APIService {
    /// Enhanced method with retry logic and endpoint-specific configuration
    public func fetchWithRetry<T: ResponseInitializable>(
        endpoint: NBAEndpoint,
        playerId: Int,
        proxy: Proxy?,
        maxRetries: Int = 3
    ) async throws -> T {
        var lastError: Error?
        
        for attempt in 1...maxRetries {
            do {
                let result: T = try await get(
                    timeoutInterval: endpoint.timeout,
                    path: endpoint.path,
                    params: endpoint.params(playerId: playerId),
                    proxy: proxy
                )
                return result
            } catch {
                lastError = error
                
                // Don't retry on certain errors
                if let urlError = error as? URLError {
                    switch urlError.code {
                    case .badURL, .unsupportedURL:
                        throw error  // Don't retry these
                    default:
                        break
                    }
                }
                
                // Exponential backoff with jitter
                if attempt < maxRetries {
                    let baseDelay = pow(2.0, Double(attempt))
                    let jitter = Double.random(in: 0...0.5)
                    let delay = min(baseDelay + jitter, 10.0)  // Max 10s delay
                    
                    print("Request failed for player \(playerId) (attempt \(attempt)/\(maxRetries)): \(error)")
                    print("Retrying in \(String(format: "%.1f", delay))s...")
                    
                    try await Task.sleep(nanoseconds: UInt64(delay * 1_000_000_000))
                }
            }
        }
        
        throw lastError ?? APIError.maxRetriesExceeded
    }
}
```

### Integration Points
- Replace direct `APIService.get()` calls with `fetchWithRetry()`
- Use endpoint enums for type safety and configuration
- Handle `APIError` cases in batch processing logic

---

## Enhancement 3: PlayerBatchProcessor

### Problem
No coordinated system exists to:
- Distribute player processing across available proxies
- Manage concurrent batches while respecting rate limits
- Coordinate between API fetching and database storage

### Solution
Create a comprehensive batch processing system that orchestrates the entire pipeline.

### Implementation

```swift
// File: NBAKit/Services/PlayerBatchProcessor.swift
import Foundation

public struct ProcessingConfig {
    public let playersPerBatch: Int
    public let maxConcurrentBatches: Int
    public let delayBetweenRequests: TimeInterval
    public let maxRetries: Int
    
    public static let conservative = ProcessingConfig(
        playersPerBatch: 50,
        maxConcurrentBatches: 5,    // Half the proxies for safety
        delayBetweenRequests: 0.2,  // 200ms between requests
        maxRetries: 3
    )
    
    public static let aggressive = ProcessingConfig(
        playersPerBatch: 100,
        maxConcurrentBatches: 10,   // All proxies
        delayBetweenRequests: 0.1,  // 100ms between requests
        maxRetries: 2
    )
}

public class PlayerBatchProcessor {
    private let proxyPool: ProxyPool
    private let apiService: APIService
    private let databaseService: DatabaseService
    private let progressTracker: ProgressTracker
    private let config: ProcessingConfig
    
    public init(
        proxyPool: ProxyPool,
        apiService: APIService,
        databaseService: DatabaseService,
        progressTracker: ProgressTracker,
        config: ProcessingConfig = .conservative
    ) {
        self.proxyPool = proxyPool
        self.apiService = apiService
        self.databaseService = databaseService
        self.progressTracker = progressTracker
        self.config = config
    }
    
    /// Process all players with concurrent batching
    public func processAllPlayers(_ playerIds: [Int]) async throws {
        let batches = playerIds.chunked(into: config.playersPerBatch)
        print("Processing \(playerIds.count) players in \(batches.count) batches")
        
        // Process batches with controlled concurrency
        try await withThrowingTaskGroup(of: Void.self) { group in
            var activeBatches = 0
            var batchIndex = 0
            
            for batch in batches {
                // Wait if we've hit the concurrency limit
                while activeBatches >= config.maxConcurrentBatches {
                    _ = try await group.next()
                    activeBatches -= 1
                }
                
                // Start processing this batch
                group.addTask {
                    await self.processBatch(batch, batchIndex: batchIndex)
                }
                activeBatches += 1
                batchIndex += 1
            }
            
            // Wait for all remaining batches to complete
            while activeBatches > 0 {
                _ = try await group.next()
                activeBatches -= 1
            }
        }
        
        print("\nProcessing completed!")
    }
    
    private func processBatch(_ playerIds: [Int], batchIndex: Int) async {
        // Acquire a proxy for this batch
        guard let proxy = await proxyPool.acquireProxy() else {
            print("Failed to acquire proxy for batch \(batchIndex)")
            return
        }
        
        defer {
            Task { await proxyPool.releaseProxy(proxy) }
        }
        
        print("Batch \(batchIndex): Processing \(playerIds.count) players with proxy \(proxy.connection.publicIp)")
        
        var processedPlayers: [Player] = []
        var processedAccolades: [PlayerAccolades] = []
        
        for playerId in playerIds {
            do {
                let playerData = try await fetchAllPlayerData(playerId: playerId, proxy: proxy)
                processedPlayers.append(playerData.player)
                processedAccolades.append(playerData.accolades)
                
                await progressTracker.updateProgress(1)
                
                // Rate limiting delay
                try await Task.sleep(nanoseconds: UInt64(config.delayBetweenRequests * 1_000_000_000))
                
            } catch {
                print("Failed to process player \(playerId): \(error)")
                await progressTracker.recordError(playerId: playerId, error: error)
            }
        }
        
        // Batch insert to database
        do {
            try await databaseService.batchInsertPlayers(processedPlayers)
            try await databaseService.batchInsertPlayerAccolades(processedAccolades)
            print("Batch \(batchIndex): Successfully saved \(processedPlayers.count) players to database")
        } catch {
            print("Batch \(batchIndex): Database error: \(error)")
        }
    }
    
    private func fetchAllPlayerData(playerId: Int, proxy: Proxy) async throws -> (player: Player, accolades: PlayerAccolades) {
        // Fetch all three endpoints concurrently
        async let commonInfo: CommonPlayerInfo = apiService.fetchWithRetry(
            endpoint: .commonPlayerInfo,
            playerId: playerId,
            proxy: proxy,
            maxRetries: config.maxRetries
        )
        
        async let awards: PlayerAwardsList = apiService.fetchWithRetry(
            endpoint: .playerAwards,
            playerId: playerId,
            proxy: proxy,
            maxRetries: config.maxRetries
        )
        
        async let profile: PlayerProfileV2 = apiService.fetchWithRetry(
            endpoint: .playerProfileV2,
            playerId: playerId,
            proxy: proxy,
            maxRetries: config.maxRetries
        )
        
        let (playerInfo, playerAwards, playerProfile) = try await (commonInfo, awards, profile)
        
        // Convert to domain models
        let player = Player(from: playerInfo, profile: playerProfile)
        let accolades = PlayerAccolades(playerId: playerId, awards: playerAwards.PlayerAwards)
        
        return (player, accolades)
    }
}

// Helper extension for chunking arrays
private extension Array {
    func chunked(into size: Int) -> [[Element]] {
        return stride(from: 0, to: count, by: size).map {
            Array(self[$0..<Swift.min($0 + size, count)])
        }
    }
}
```

### Integration Points
- Initialize with all required services
- Call `processAllPlayers()` from your main command
- Configure processing strategy based on requirements

---

## Enhancement 4: Progress Tracking System

### Problem
No visibility into processing progress, making it difficult to:
- Monitor processing status during long-running operations
- Identify bottlenecks or failures
- Estimate completion time

### Solution
Implement a comprehensive progress tracking system with console output and error reporting.

### Implementation

```swift
// File: NBAKit/Services/ProgressTracker.swift
import Foundation

public actor ProgressTracker {
    private var completed: Int = 0
    private var failed: Int = 0
    private let total: Int
    private let startTime: Date
    private var errors: [Int: Error] = [:]
    private var lastUpdateTime: Date = Date()
    
    public init(total: Int) {
        self.total = total
        self.startTime = Date()
    }
    
    /// Update progress with successful completion
    public func updateProgress(_ increment: Int = 1) async {
        completed += increment
        await displayProgress()
    }
    
    /// Record an error for a specific player
    public func recordError(playerId: Int, error: Error) async {
        failed += 1
        errors[playerId] = error
        await displayProgress()
    }
    
    /// Display current progress
    private func displayProgress() async {
        let now = Date()
        
        // Throttle updates to every 100ms for performance
        guard now.timeIntervalSince(lastUpdateTime) >= 0.1 else { return }
        lastUpdateTime = now
        
        let totalProcessed = completed + failed
        let percentage = totalProcessed > 0 ? Double(totalProcessed) / Double(total) * 100 : 0
        let elapsed = now.timeIntervalSince(startTime)
        let rate = elapsed > 0 ? Double(totalProcessed) / elapsed : 0
        let eta = rate > 0 ? (Double(total - totalProcessed) / rate) : 0
        
        let barWidth = 40
        let filledWidth = Int(Double(barWidth) * percentage / 100)
        let bar = String(repeating: "█", count: filledWidth) + 
                 String(repeating: "░", count: barWidth - filledWidth)
        
        let statusLine = String(format: 
            "\r[\(bar)] %.1f%% (%d/%d) | ✓%d ✗%d | %.1f req/s | ETA: %02d:%02d",
            percentage,
            totalProcessed,
            total,
            completed,
            failed,
            rate,
            Int(eta) / 60,
            Int(eta) % 60
        )
        
        print(statusLine, terminator: "")
        fflush(stdout)
    }
    
    /// Get final summary
    public func getFinalSummary() async -> ProcessingSummary {
        let elapsed = Date().timeIntervalSince(startTime)
        let totalProcessed = completed + failed
        let rate = elapsed > 0 ? Double(totalProcessed) / elapsed : 0
        
        return ProcessingSummary(
            totalPlayers: total,
            completed: completed,
            failed: failed,
            errors: errors,
            totalTime: elapsed,
            averageRate: rate
        )
    }
}

public struct ProcessingSummary {
    public let totalPlayers: Int
    public let completed: Int
    public let failed: Int
    public let errors: [Int: Error]
    public let totalTime: TimeInterval
    public let averageRate: Double
    
    public func printSummary() {
        print("\n" + "=".repeating(60))
        print("Processing Summary")
        print("=".repeating(60))
        print(String(format: "Total Players: %d", totalPlayers))
        print(String(format: "Completed: %d (%.1f%%)", completed, Double(completed) / Double(totalPlayers) * 100))
        print(String(format: "Failed: %d (%.1f%%)", failed, Double(failed) / Double(totalPlayers) * 100))
        print(String(format: "Total Time: %02d:%02d", Int(totalTime) / 60, Int(totalTime) % 60))
        print(String(format: "Average Rate: %.1f players/second", averageRate))
        print("=".repeating(60))
        
        if !errors.isEmpty {
            print("\nFailed Players:")
            for (playerId, error) in errors.prefix(10) {  // Show first 10 errors
                print("  Player \(playerId): \(error)")
            }
            if errors.count > 10 {
                print("  ... and \(errors.count - 10) more")
            }
        }
    }
}

extension String {
    func repeating(_ count: Int) -> String {
        return String(repeating: self, count: count)
    }
}
```

### Integration Points
- Initialize with total player count
- Call `updateProgress()` after each successful player
- Call `recordError()` for failures
- Display final summary when complete

---

## Enhancement 5: Updated PopulateCommand Integration

### Problem
The current `PopulateCommand` is empty and needs to orchestrate all these new services.

### Solution
Create a comprehensive command that initializes and coordinates all services.

### Implementation

```swift
// File: nba_db/Commands/PopulateCommand.swift
import ArgumentParser
import Foundation
import NBAKit

struct PopulateCommand: AsyncParsableCommand {
    @Option(name: .shortAndLong, help: "Processing strategy (conservative/aggressive)")
    var strategy: String = "conservative"
    
    @Option(name: .shortAndLong, help: "Maximum number of players to process (for testing)")
    var limit: Int?
    
    func run() async throws {
        print("🏀 NBA Player Data Population Tool")
        print("=".repeating(50))
        
        // Initialize services
        print("Initializing services...")
        let databaseConfig = DatabaseConfig(
            database: "nba_players",
            username: "your_username",
            password: "your_password",
            maxConnections: 20,
            batchSize: 2000
        )
        
        let databaseService = try DatabaseService(config: databaseConfig)
        let apiService = APIService.nbaApiService
        let proxyPool = ProxyPool()
        
        // Initialize proxy pool
        print("Testing and initializing proxy pool...")
        let proxyService = ProxyService()
        await proxyService.fetchProxies()
        // Note: You'll need to modify ProxyService to expose tested proxies
        // await proxyPool.initialize(with: proxyService.getTestedProxies())
        
        // Get player list
        let allPlayers = PlayersList.allPlayers
        let playersToProcess = limit.map { Array(allPlayers.prefix($0)) } ?? allPlayers
        let playerIds = playersToProcess.map { $0.id }
        
        print("Processing \(playerIds.count) players...")
        
        // Initialize progress tracker
        let progressTracker = ProgressTracker(total: playerIds.count)
        
        // Configure processing strategy
        let config: ProcessingConfig = strategy == "aggressive" ? .aggressive : .conservative
        print("Using \(strategy) processing strategy")
        print("- Players per batch: \(config.playersPerBatch)")
        print("- Max concurrent batches: \(config.maxConcurrentBatches)")
        print("- Delay between requests: \(config.delayBetweenRequests)s")
        
        // Initialize batch processor
        let processor = PlayerBatchProcessor(
            proxyPool: proxyPool,
            apiService: apiService,
            databaseService: databaseService,
            progressTracker: progressTracker,
            config: config
        )
        
        // Start processing
        print("\nStarting player data processing...")
        do {
            try await processor.processAllPlayers(playerIds)
            
            let summary = await progressTracker.getFinalSummary()
            summary.printSummary()
            
        } catch {
            print("\nProcessing failed with error: \(error)")
            let summary = await progressTracker.getFinalSummary()
            summary.printSummary()
        }
        
        // Cleanup
        try await databaseService.close()
        print("\n✅ Processing complete!")
    }
}

extension String {
    func repeating(_ count: Int) -> String {
        return String(repeating: self, count: count)
    }
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (1-2 days)
1. Create `ProxyPool` actor
2. Enhance `APIService` with retry logic
3. Update `ProxyService` to work with `ProxyPool`

### Phase 2: Processing Pipeline (2-3 days)
1. Implement `ProgressTracker`
2. Create `PlayerBatchProcessor`
3. Add domain model converters (Player, PlayerAccolades)

### Phase 3: Integration & Testing (1-2 days)
1. Update `PopulateCommand`
2. Test with small player subsets
3. Fine-tune batch sizes and delays

### Phase 4: Production Optimization (1 day)
1. Monitor performance with full dataset
2. Adjust concurrency settings based on results
3. Add additional error handling and logging

## Performance Expectations

### Conservative Strategy
- **Batch Size**: 50 players
- **Concurrent Batches**: 5
- **Request Delay**: 200ms
- **Estimated Time**: ~25-30 minutes
- **Success Rate**: ~95%

### Aggressive Strategy
- **Batch Size**: 100 players  
- **Concurrent Batches**: 10
- **Request Delay**: 100ms
- **Estimated Time**: ~12-15 minutes
- **Success Rate**: ~85-90% (higher chance of rate limiting)

Start with the conservative approach and adjust based on observed NBA API behavior and proxy performance.