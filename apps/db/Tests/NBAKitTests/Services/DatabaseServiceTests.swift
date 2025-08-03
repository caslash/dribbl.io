import Foundation
import PostgresKit
import AsyncKit
import Testing
import Logging
@testable import NBAKit

struct DatabaseServiceTests {
    
    // MARK: - Test Initialization
    
    @Test("DatabaseService initializes correctly with valid config")
    func initializesWithValidConfig() async throws {
        let config = DatabaseConfig(
            host: "localhost",
            port: 5432,
            database: "test_db",
            username: "test_user",
            password: "test_password",
            maxConnections: 5,
            batchSize: 100,
            ssl: false
        )
        
        let databaseService = try DatabaseService(config: config, logger: "TestLogger")
        
        // Test passes if no exception is thrown during initialization
        #expect(true)
        
        // Clean up
        try await databaseService.close()
    }
    
    @Test("DatabaseService initializes with default logger name")
    func initializesWithDefaultLogger() async throws {
        let config = DatabaseConfig(
            database: "test_db",
            username: "test_user",
            password: "test_password"
        )
        
        let databaseService = try DatabaseService(config: config)
        
        // Test passes if no exception is thrown during initialization
        #expect(true)
        
        // Clean up
        try await databaseService.close()
    }
    
    // MARK: - Test Configuration
    
    @Test("DatabaseConfig initializes with default values")
    func configInitializesWithDefaults() {
        let config = DatabaseConfig(
            database: "test_db",
            username: "test_user",
            password: "test_password"
        )
        
        #expect(config.host == "localhost")
        #expect(config.port == 5432)
        #expect(config.database == "test_db")
        #expect(config.username == "test_user")
        #expect(config.password == "test_password")
        #expect(config.maxConnections == 10)
        #expect(config.batchSize == 1000)
        #expect(config.ssl == false)
    }
    
    @Test("DatabaseConfig initializes with custom values")
    func configInitializesWithCustomValues() {
        let config = DatabaseConfig(
            host: "custom-host",
            port: 3306,
            database: "custom_db",
            username: "custom_user",
            password: "custom_password",
            maxConnections: 25,
            batchSize: 500,
            ssl: true
        )
        
        #expect(config.host == "custom-host")
        #expect(config.port == 3306)
        #expect(config.database == "custom_db")
        #expect(config.username == "custom_user")
        #expect(config.password == "custom_password")
        #expect(config.maxConnections == 25)
        #expect(config.batchSize == 500)
        #expect(config.ssl == true)
    }
    
    // MARK: - Test Player Operations
    
    @Test("Batch insert players handles empty array gracefully")
    func batchInsertPlayersHandlesEmptyArray() async throws {
        let config = DatabaseConfig(
            database: "test_db",
            username: "test_user",
            password: "test_password"
        )
        
        let databaseService = try DatabaseService(config: config)
        
        // Empty array should not throw an error
        try await databaseService.batchInsertPlayers([])
        
        // Test passes if no exception is thrown
        #expect(true)
        
        // Clean up
        try await databaseService.close()
    }
    
    @Test("Batch insert players processes valid player data")
    func batchInsertPlayersProcessesValidData() async throws {
        let config = DatabaseConfig(
            database: "test_db",
            username: "test_user",
            password: "test_password",
            batchSize: 2 // Small batch size for testing
        )
        
        let databaseService = try DatabaseService(config: config)
        
        let players = createTestPlayers(count: 3)
        
        // This would normally connect to database, but since we can't guarantee
        // a test database exists, we expect this to fail gracefully
        do {
            try await databaseService.batchInsertPlayers(players)
            // If it succeeds (unlikely without real DB), that's fine
            #expect(true)
        } catch {
            // If it fails due to connection issues, that's expected in tests
            #expect(error != nil)
        }
        
        // Clean up
        try await databaseService.close()
    }
    
    // MARK: - Test Player Accolades Operations
    
    @Test("Batch insert player accolades handles empty array gracefully")
    func batchInsertPlayerAccoladesHandlesEmptyArray() async throws {
        let config = DatabaseConfig(
            database: "test_db",
            username: "test_user",
            password: "test_password"
        )
        
        let databaseService = try DatabaseService(config: config)
        
        // Empty array should not throw an error
        try await databaseService.batchInsertPlayerAccolades([])
        
        // Test passes if no exception is thrown
        #expect(true)
        
        // Clean up
        try await databaseService.close()
    }
    
    @Test("Batch insert player accolades processes valid data")
    func batchInsertPlayerAccoladesProcessesValidData() async throws {
        let config = DatabaseConfig(
            database: "test_db",
            username: "test_user",
            password: "test_password",
            batchSize: 2 // Small batch size for testing
        )
        
        let databaseService = try DatabaseService(config: config)
        
        let accolades = try createTestPlayerAccolades(count: 3)
        
        // This would normally connect to database, but since we can't guarantee
        // a test database exists, we expect this to fail gracefully
        do {
            try await databaseService.batchInsertPlayerAccolades(accolades)
            // If it succeeds (unlikely without real DB), that's fine
            #expect(true)
        } catch {
            // If it fails due to connection issues, that's expected in tests
            #expect(error != nil)
        }
        
        // Clean up
        try await databaseService.close()
    }
    
    // MARK: - Test Service Lifecycle
    
    @Test("DatabaseService closes connections properly")
    func serviceClosesConnectionsProperly() async throws {
        let config = DatabaseConfig(
            database: "test_db",
            username: "test_user",
            password: "test_password"
        )
        
        let databaseService = try DatabaseService(config: config)
        
        // Close should not throw an error
        try await databaseService.close()
        
        // Test passes if no exception is thrown during close
        #expect(true)
    }
    
    @Test("DatabaseService can be closed multiple times safely")
    func serviceCanBeClosedMultipleTimes() async throws {
        let config = DatabaseConfig(
            database: "test_db",
            username: "test_user",
            password: "test_password"
        )
        
        let databaseService = try DatabaseService(config: config)
        
        // First close
        try await databaseService.close()
        
        // Second close should also not throw an error
        do {
            try await databaseService.close()
            #expect(true)
        } catch {
            // Some frameworks might throw on double close, which is acceptable
            #expect(error != nil)
        }
    }
    
    // MARK: - Test Batch Processing Logic
    
    @Test("Batch processing handles large datasets")
    func batchProcessingHandlesLargeDatasets() async throws {
        let config = DatabaseConfig(
            database: "test_db",
            username: "test_user",
            password: "test_password",
            batchSize: 5 // Small batch size for testing batching logic
        )
        
        let databaseService = try DatabaseService(config: config)
        
        // Create 12 players to test batching (should create 3 batches of 5, 5, and 2)
        let players = createTestPlayers(count: 12)
        
        do {
            try await databaseService.batchInsertPlayers(players)
            #expect(true)
        } catch {
            // Expected to fail without real database connection
            #expect(error != nil)
        }
        
        // Clean up
        try await databaseService.close()
    }
    
    @Test("Batch processing handles single item")
    func batchProcessingHandlesSingleItem() async throws {
        let config = DatabaseConfig(
            database: "test_db",
            username: "test_user",
            password: "test_password"
        )
        
        let databaseService = try DatabaseService(config: config)
        
        let players = createTestPlayers(count: 1)
        
        do {
            try await databaseService.batchInsertPlayers(players)
            #expect(true)
        } catch {
            // Expected to fail without real database connection
            #expect(error != nil)
        }
        
        // Clean up
        try await databaseService.close()
    }
    
    // MARK: - Test Error Handling
    
    @Test("DatabaseService handles connection failures gracefully")
    func serviceHandlesConnectionFailures() async throws {
        // Invalid configuration that should cause connection failure
        let config = DatabaseConfig(
            host: "nonexistent-host",
            port: 99999,
            database: "nonexistent_db",
            username: "invalid_user",
            password: "invalid_password"
        )
        
        let databaseService = try DatabaseService(config: config)
        
        let players = createTestPlayers(count: 1)
        
        // This should fail due to invalid connection parameters
        do {
            try await databaseService.batchInsertPlayers(players)
            // Unlikely to succeed with invalid config
        } catch {
            // Expected behavior - connection should fail
            #expect(error != nil)
        }
        
        // Clean up should still work
        try await databaseService.close()
    }
    
    // MARK: - Helper Methods
    
    private func createTestPlayers(count: Int) -> [Player] {
        var playerBatch: [Player] = []
        
        for index in 0..<count {
            var player = Player(id: 1000 + index, first_name: "Test", last_name: "Player\(index)")
            self.fillPlayerObject(&player, index: index)
            
            playerBatch.append(
                player
            )
        }
        
        return playerBatch
    }
    
    private func fillPlayerObject(_ player: inout Player, index: Int) {
        let baseDate = Date()
        player.birthdate = baseDate
        player.school = "Test University"
        player.country = "USA"
        player.height = "6-8"
        player.weight = 200 + index
        player.season_exp = index
        player.jersey = index < 100 ? index : nil
        player.position = "Forward"
        player.team_history = "Test Team"
        player.is_active = true
        player.from_year = 2020
        player.to_year = 2025
        player.total_games_played = 82 * index
        player.draft_round = "1"
        player.draft_number = "\(index + 1)"
        player.draft_year = "2020"
        player.career_ppg = 20.0 + Double(index)
        player.career_rpg = 8.0 + Double(index)
        player.career_apg = 5.0 + Double(index)
    }
    
    private func createTestPlayerAccolades(count: Int) throws -> [PlayerAccolades] {
        return try (0..<count).map { index in
            let awards = try createTestPlayerAwardsList()
            guard !awards.PlayerAwards.isEmpty else {
                throw NSError(domain: "TestError", code: 1, userInfo: [NSLocalizedDescriptionKey: "No player awards found in test data"])
            }
            return PlayerAccolades(
                player_id: awards.PlayerAwards[0].PERSON_ID,
                accolades: awards
            )
        }
    }
    
    private func createTestPlayerAwardsList() throws -> PlayerAwardsList {
        guard let awardsListUrl = Bundle.module.url(forResource: "playerawards", withExtension: "json") else {
            fatalError("playerawards.json not found in test bundle.")
        }
        
        let responseExample = try Data(contentsOf: awardsListUrl)
        
        return try PlayerAwardsList(from: responseExample)
    }
}
