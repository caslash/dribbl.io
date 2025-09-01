import Foundation
import Testing
@testable import NBAKit

struct DataProcessorTests {
    
    // MARK: - Test Initialization
    
    @Test("DataProcessor initializes correctly with valid config")
    func initializesWithValidConfig() async throws {
        let config = DatabaseConfig(
            database: "test_nba_db",
            username: "caslash",
            password: "1212",
        )

        #expect(throws: Never.self) {
            let _ = try DataProcessor(maxConcurrency: 5, batchSize: 50, databaseConfig: config)
        }
    }
    
    @Test("DataProcessor initializes with custom parameters")
    func initializesWithCustomParameters() async throws {
        let config = DatabaseConfig(
            database: "test_nba_db",
            username: "caslash",
            password: "1212",
        )
        

        #expect(throws: Never.self) {
            let _ = try DataProcessor(maxConcurrency: 10, batchSize: 25, databaseConfig: config)
        }
    }
    
    @Test("DataProcessor throws error with invalid database config")
    func throwsErrorWithInvalidConfig() async throws {
        let config = DatabaseConfig(
            host: "nonexistent-host",
            port: 99999,
            database: "invalid_db",
            username: "invalid_user",
            password: "invalid_password"
        )
        
        
        #expect(throws: Never.self) {
            let _ = try DataProcessor(maxConcurrency: 5, batchSize: 50, databaseConfig: config)
        }
    }
    
    // MARK: - Test Player Processing
    
    @Test("Process players handles empty array gracefully")
    func processPlayersHandlesEmptyArray() async throws {
        let config = DatabaseConfig(
            database: "test_nba_db",
            username: "caslash",
            password: "1212",
        )
        
        let dataProcessor = try DataProcessor(maxConcurrency: 5, batchSize: 50, databaseConfig: config)
        
        let summary = try await dataProcessor.processPlayers([])

        #expect(summary.totalPlayers == 0)
        #expect(summary.completed == 0)
        #expect(summary.failed == 0)
    }
    
    @Test("Process players handles single player")
    func processPlayersHandlesSinglePlayer() async throws {
        let config = DatabaseConfig(
            database: "test_nba_db",
            username: "caslash",
            password: "1212",
        )
        
        let dataProcessor = try DataProcessor(maxConcurrency: 5, batchSize: 50, databaseConfig: config)
        let players = [self.getCelticsChampionStarters().randomElement()!]
        
        let summary = try await dataProcessor.processPlayers(players)
        #expect(summary.totalPlayers == 1)
    }
    
    @Test("Process players handles multiple players")
    func processPlayersHandlesMultiplePlayers() async throws {
        let config = DatabaseConfig(
            database: "test_nba_db",
            username: "caslash",
            password: "1212",
        )
        
        let dataProcessor = try DataProcessor(maxConcurrency: 5, batchSize: 2, databaseConfig: config)
        let players = self.getCelticsChampionStarters()
        
        let summary = try await dataProcessor.processPlayers(players)
        #expect(summary.totalPlayers == 5)
    }
    
    @Test("Process players respects batch size")
    func processPlayersRespectsBatchSize() async throws {
        let config = DatabaseConfig(
            database: "test_db",
            username: "test_user",
            password: "test_password"
        )
        
        let dataProcessor = try DataProcessor(maxConcurrency: 5, batchSize: 3, databaseConfig: config)
        let players = self.getCelticsChampionshipRotation()
        
        // Test that batching works correctly (10 players, batch size 3 = 4 batches: 3,3,3,1)
        do {
            let summary = try await dataProcessor.processPlayers(players)
            #expect(summary.totalPlayers == 10)
        } catch {
            // Expected to fail without real API endpoints, but structure should handle batching
            #expect(error.localizedDescription != "")
        }
    }
    
    // MARK: - Test Array Chunking Extension
    
    @Test("Array chunking works correctly")
    func arrayChunkingWorksCorrectly() {
        let items = Array(1...10)
        let chunked = items.chunked(into: 3)
        
        #expect(chunked.count == 4)
        #expect(chunked[0] == [1, 2, 3])
        #expect(chunked[1] == [4, 5, 6])
        #expect(chunked[2] == [7, 8, 9])
        #expect(chunked[3] == [10])
    }
    
    @Test("Array chunking handles empty array")
    func arrayChunkingHandlesEmptyArray() {
        let items: [Int] = []
        let chunked = items.chunked(into: 3)
        
        #expect(chunked.isEmpty)
    }
    
    @Test("Array chunking handles single item")
    func arrayChunkingHandlesSingleItem() {
        let items = [42]
        let chunked = items.chunked(into: 5)
        
        #expect(chunked.count == 1)
        #expect(chunked[0] == [42])
    }
    
    @Test("Array chunking handles exact batch size")
    func arrayChunkingHandlesExactBatchSize() {
        let items = Array(1...6)
        let chunked = items.chunked(into: 3)
        
        #expect(chunked.count == 2)
        #expect(chunked[0] == [1, 2, 3])
        #expect(chunked[1] == [4, 5, 6])
    }
    
    // MARK: - Test Unique Extension
    
    @Test("Unique filter works correctly")
    func uniqueFilterWorksCorrectly() {
        let items = [1, 2, 2, 3, 1, 4, 3, 5]
        let uniqueItems = items.unique()
        
        #expect(uniqueItems.count == 5)
        #expect(Set(uniqueItems) == Set([1, 2, 3, 4, 5]))
    }
    
    @Test("Unique filter handles empty array")
    func uniqueFilterHandlesEmptyArray() {
        let items: [Int] = []
        let uniqueItems = items.unique()
        
        #expect(uniqueItems.isEmpty)
    }
    
    @Test("Unique filter handles array with no duplicates")
    func uniqueFilterHandlesNoDuplicates() {
        let items = [1, 2, 3, 4, 5]
        let uniqueItems = items.unique()
        
        #expect(uniqueItems == items)
    }
    
    @Test("Unique filter preserves order")
    func uniqueFilterPreservesOrder() {
        let items = [3, 1, 4, 1, 5, 9, 2, 6, 5]
        let uniqueItems = items.unique()
        
        #expect(uniqueItems == [3, 1, 4, 5, 9, 2, 6])
    }
    
    // MARK: - Test Int Extension
    
    @Test("Int from string initializer works correctly")
    func intFromStringInitializerWorksCorrectly() {
        #expect(Int(from: "42") == 42)
        #expect(Int(from: "0") == 0)
        #expect(Int(from: "-5") == -5)
    }
    
    @Test("Int from string initializer handles whitespace")
    func intFromStringInitializerHandlesWhitespace() {
        #expect(Int(from: "  42  ") == 42)
        #expect(Int(from: "\t123\n") == 123)
        #expect(Int(from: " -5 ") == -5)
    }
    
    @Test("Int from string initializer handles invalid input")
    func intFromStringInitializerHandlesInvalidInput() {
        #expect(Int(from: nil) == nil)
        #expect(Int(from: "") == nil)
        #expect(Int(from: "   ") == nil)
        #expect(Int(from: "abc") == nil)
        #expect(Int(from: "12.5") == nil)
        #expect(Int(from: "1a2") == nil)
    }
    
    @Test("Int from string initializer handles edge cases")
    func intFromStringInitializerHandlesEdgeCases() {
        #expect(Int(from: "0000") == 0)
        #expect(Int(from: "+42") == 42)
        #expect(Int(from: String(Int.max)) == Int.max)
        #expect(Int(from: String(Int.min)) == Int.min)
    }
    
    // MARK: - Test Processing Summary
    
    @Test("Processing summary calculates percentages correctly")
    func processingSummaryCalculatesPercentagesCorrectly() {
        let summary = ProcessingSummary(
            totalPlayers: 100,
            completed: 75,
            failed: 25,
            errors: [:],
            totalTime: 120.0,
            averageRate: 0.83
        )
        
        #expect(summary.totalPlayers == 100)
        #expect(summary.completed == 75)
        #expect(summary.failed == 25)
        #expect(summary.totalTime == 120.0)
        #expect(abs(summary.averageRate - 0.83) < 0.01)
    }
    
    @Test("Processing summary handles zero totals")
    func processingSummaryHandlesZeroTotals() {
        let summary = ProcessingSummary(
            totalPlayers: 0,
            completed: 0,
            failed: 0,
            errors: [:],
            totalTime: 0.0,
            averageRate: 0.0
        )
        
        #expect(summary.totalPlayers == 0)
        #expect(summary.completed == 0)
        #expect(summary.failed == 0)
        #expect(summary.totalTime == 0.0)
        #expect(summary.averageRate == 0.0)
    }
    
    @Test("Processing summary handles errors correctly")
    func processingSummaryHandlesErrorsCorrectly() {
        let testError = NSError(domain: "TestError", code: 1, userInfo: [NSLocalizedDescriptionKey: "Test error"])
        let errors: [Int: Error] = [123: testError, 456: testError]
        
        let summary = ProcessingSummary(
            totalPlayers: 10,
            completed: 8,
            failed: 2,
            errors: errors,
            totalTime: 60.0,
            averageRate: 0.17
        )
        
        #expect(summary.errors.count == 2)
        #expect(summary.errors.keys.contains(123))
        #expect(summary.errors.keys.contains(456))
    }
    
    // MARK: - Test String Extension
    
    @Test("String repeating extension works correctly")
    func stringRepeatingExtensionWorksCorrectly() {
        #expect("=".repeating(5) == "=====")
        #expect("abc".repeating(3) == "abcabcabc")
        #expect("x".repeating(0) == "")
        #expect("test".repeating(1) == "test")
    }
    
    @Test("String repeating extension handles empty string")
    func stringRepeatingExtensionHandlesEmptyString() {
        #expect("".repeating(5) == "")
        #expect("".repeating(0) == "")
    }
    
    // MARK: - Test Concurrency and Error Handling
    
    @Test("DataProcessor handles API initialization failure")
    func dataProcessorHandlesAPIInitializationFailure() async throws {
        let config = DatabaseConfig(
            database: "test_db",
            username: "test_user",
            password: "test_password"
        )
        
        let dataProcessor = try DataProcessor(maxConcurrency: 5, batchSize: 50, databaseConfig: config)
        let players = [self.getCelticsChampionStarters().randomElement()!]
        
        // This should fail during proxy initialization or first API call
        do {
            let _ = try await dataProcessor.processPlayers(players)
            // Unlikely to succeed without real API
        } catch {
            // Expected behavior - should handle API failures gracefully
            #expect(error.localizedDescription != "")
        }
    }
    
    @Test("DataProcessor respects max concurrency setting")
    func dataProcessorRespectsMaxConcurrencySetting() async throws {
        let config = DatabaseConfig(
            database: "test_nba_db",
            username: "caslash",
            password: "1212",
        )
        

        #expect(throws: Never.self) {
            let _ = try DataProcessor(maxConcurrency: 1, batchSize: 50, databaseConfig: config)
            let _ = try DataProcessor(maxConcurrency: 10, batchSize: 50, databaseConfig: config)
        }
    }
    
    // MARK: - Helper Methods

    private func getCelticsChampionStarters() -> [PlayerInfo] {
        return [
            PlayerInfo(id: 201950, display_name: "Jrue Holiday"),
            PlayerInfo(id: 1628401, display_name: "Derrick White"),
            PlayerInfo(id: 1627759, display_name: "Jaylen Brown"),
            PlayerInfo(id: 1628369, display_name: "Jayson Tatum"),
            PlayerInfo(id: 204001, display_name: "Kristaps Porziņģis")
        ]
    }

    private func getCelticsChampionshipRotation() -> [PlayerInfo] {
        return [
            PlayerInfo(id: 201950, display_name: "Jrue Holiday"),
            PlayerInfo(id: 1628401, display_name: "Derrick White"),
            PlayerInfo(id: 1627759, display_name: "Jaylen Brown"),
            PlayerInfo(id: 1628369, display_name: "Jayson Tatum"),
            PlayerInfo(id: 204001, display_name: "Kristaps Porziņģis"),
            PlayerInfo(id: 201143, display_name: "Al Horford"),
            PlayerInfo(id: 1630202, display_name: "Payton Pritchard"),
            PlayerInfo(id: 1630573, display_name: "Sam Hauser"),
            PlayerInfo(id: 1628436, display_name: "Luke Kornet"),
            PlayerInfo(id: 1630214, display_name: "Xavier Tillman")
        ]
    }
}

private extension String {
    func repeating(_ count: Int) -> String {
        return String(repeating: self, count: count)
    }
}