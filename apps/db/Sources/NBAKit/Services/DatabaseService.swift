import Foundation
internal import PostgresKit
internal import AsyncKit
internal import Logging

// MARK: - Configuration
public struct DatabaseConfig {
    public let host: String
    public let port: Int
    public let database: String
    public let username: String
    public let password: String
    public let maxConnections: Int
    public let batchSize: Int
    public let ssl: Bool
    
    public init(
        host: String = "localhost",
        port: Int = 5432,
        database: String,
        username: String,
        password: String,
        maxConnections: Int = 10,
        batchSize: Int = 1000,
        ssl: Bool = false
    ) {
        self.host = host
        self.port = port
        self.database = database
        self.username = username
        self.password = password
        self.maxConnections = maxConnections
        self.batchSize = batchSize
        self.ssl = ssl
    }
}

// MARK: - Database Service Protocol
public protocol DatabaseServiceProtocol {
    func batchInsertPlayers(_ players: [Player]) async throws
    func batchInsertPlayerAccolades(_ accolades: [PlayerAccolades]) async throws
    func close() async throws
}

// MARK: - Database Service Implementation
public final class DatabaseService: DatabaseServiceProtocol {
    private let eventLoopGroup: EventLoopGroup
    private let connectionPool: EventLoopGroupConnectionPool<PostgresConnectionSource>
    private let config: DatabaseConfig
    private let logger: Logger
    private let jsonEncoder: JSONEncoder
    private let dateFormatter: DateFormatter
    private var isClosed = false
    
    public init(config: DatabaseConfig, logger: String = "DatabaseService") throws {
        self.config = config
        self.logger = Logger(label: logger)
        self.eventLoopGroup = MultiThreadedEventLoopGroup(numberOfThreads: System.coreCount)
        
        // Setup JSON encoder for JSONB fields
        self.jsonEncoder = JSONEncoder()
        self.jsonEncoder.outputFormatting = [.sortedKeys]
        
        // Setup date formatter for PostgreSQL date format
        self.dateFormatter = DateFormatter()
        self.dateFormatter.dateFormat = "yyyy-MM-dd"
        self.dateFormatter.timeZone = TimeZone(secondsFromGMT: 0)
        
        // Configure PostgreSQL connection
        let postgresConfig = SQLPostgresConfiguration(
            hostname: config.host,
            port: config.port,
            username: config.username,
            password: config.password,
            database: config.database,
            tls: config.ssl ? .prefer(try! NIOSSLContext(configuration: .clientDefault)) : .disable
        )
        
        let connectionSource = PostgresConnectionSource(sqlConfiguration: postgresConfig)
        
        self.connectionPool = EventLoopGroupConnectionPool(
            source: connectionSource,
            maxConnectionsPerEventLoop: config.maxConnections,
            on: self.eventLoopGroup
        )
        
        self.logger.info("DatabaseService initialized with max connections: \(config.maxConnections), batch size: \(config.batchSize)")
    }
    
    // MARK: - Player Operations
    public func batchInsertPlayers(_ players: [Player]) async throws {
        guard !players.isEmpty else {
            self.logger.debug("No players to insert")
            return
        }
        
        self.logger.info("Starting batch insert of \(players.count) players")
        
        // Process in batches to avoid overwhelming the database
        let batches = players.chunked(into: config.batchSize)
        var successCount = 0
        var failureCount = 0
        
        for (batchIndex, batch) in batches.enumerated() {
            do {
                try await self.insertPlayerBatch(batch, batchIndex: batchIndex + 1, totalBatches: batches.count)
                successCount += batch.count
                self.logger.debug("Successfully inserted batch \(batchIndex + 1)/\(batches.count) with \(batch.count) players")
            } catch {
                failureCount += batch.count
                self.logger.error("Failed to insert player batch \(batchIndex + 1): \(error)")
                // Continue with next batch instead of failing completely
            }
        }
        
        logger.info("Player batch insert completed: \(successCount) successful, \(failureCount) failed")
    }
    
    private func insertPlayerBatch(_ players: [Player], batchIndex: Int, totalBatches: Int) async throws {
        try await self.connectionPool.withConnection { connection in
            let sql = """
                INSERT INTO players (
                    id, first_name, last_name, birthdate, school, country, height, weight,
                    season_exp, jersey, position, team_history, is_active, from_year, to_year,
                    total_games_played, draft_round, draft_number, draft_year,
                    career_ppg, career_rpg, career_apg
                ) VALUES 
                """ + players.enumerated().map { index, _ in
                    let baseParam = index * 22 + 1
                    return "($\(baseParam), $\(baseParam+1), $\(baseParam+2), $\(baseParam+3), $\(baseParam+4), $\(baseParam+5), $\(baseParam+6), $\(baseParam+7), $\(baseParam+8), $\(baseParam+9), $\(baseParam+10), $\(baseParam+11), $\(baseParam+12), $\(baseParam+13), $\(baseParam+14), $\(baseParam+15), $\(baseParam+16), $\(baseParam+17), $\(baseParam+18), $\(baseParam+19), $\(baseParam+20), $\(baseParam+21), $\(baseParam+22))"
                }.joined(separator: ", ") + """
                ON CONFLICT (id) DO UPDATE SET
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    birthdate = EXCLUDED.birthdate,
                    school = EXCLUDED.school,
                    country = EXCLUDED.country,
                    height = EXCLUDED.height,
                    weight = EXCLUDED.weight,
                    season_exp = EXCLUDED.season_exp,
                    jersey = EXCLUDED.jersey,
                    position = EXCLUDED.position,
                    team_history = EXCLUDED.team_history,
                    is_active = EXCLUDED.is_active,
                    from_year = EXCLUDED.from_year,
                    to_year = EXCLUDED.to_year,
                    total_games_played = EXCLUDED.total_games_played,
                    draft_round = EXCLUDED.draft_round,
                    draft_number = EXCLUDED.draft_number,
                    draft_year = EXCLUDED.draft_year,
                    career_ppg = EXCLUDED.career_ppg,
                    career_rpg = EXCLUDED.career_rpg,
                    career_apg = EXCLUDED.career_apg
                """
            
            var bindings: [PostgresData] = []
            
            for player in players {
                bindings.append(contentsOf: [
                    PostgresData(int: player.id),
                    PostgresData(string: player.first_name),
                    PostgresData(string: player.last_name),
                    player.birthdate.map { PostgresData(string: self.dateFormatter.string(from: $0)) } ?? PostgresData.null,
                    player.school.map { PostgresData(string: $0) } ?? PostgresData.null,
                    player.country.map { PostgresData(string: $0) } ?? PostgresData.null,
                    player.height.map { PostgresData(string: $0) } ?? PostgresData.null,
                    player.weight.map { PostgresData(int: $0) } ?? PostgresData.null,
                    player.season_exp.map { PostgresData(int: $0) } ?? PostgresData.null,
                    player.jersey.map { PostgresData(int: $0) } ?? PostgresData.null,
                    player.position.map { PostgresData(string: $0) } ?? PostgresData.null,
                    player.team_history.map { PostgresData(string: $0) } ?? PostgresData.null,
                    player.is_active.map { PostgresData(bool: $0) } ?? PostgresData.null,
                    player.from_year.map { PostgresData(int: $0) } ?? PostgresData.null,
                    player.to_year.map { PostgresData(int: $0) } ?? PostgresData.null,
                    player.total_games_played.map { PostgresData(int: $0) } ?? PostgresData.null,
                    player.draft_round.map { PostgresData(string: $0) } ?? PostgresData.null,
                    player.draft_number.map { PostgresData(string: $0) } ?? PostgresData.null,
                    player.draft_year.map { PostgresData(string: $0) } ?? PostgresData.null,
                    player.career_ppg.map { PostgresData(double: $0) } ?? PostgresData.null,
                    player.career_rpg.map { PostgresData(double: $0) } ?? PostgresData.null,
                    player.career_apg.map { PostgresData(double: $0) } ?? PostgresData.null
                ])
            }
            
            return connection.query(sql, bindings).map { _ in }
        }.get()
    }
    
    // MARK: - Player Accolades Operations
    public func batchInsertPlayerAccolades(_ accolades: [PlayerAccolades]) async throws {
        guard !accolades.isEmpty else {
            logger.debug("No player accolades to insert")
            return
        }
        
        logger.info("Starting batch insert of \(accolades.count) player accolades")
        
        let batches = accolades.chunked(into: config.batchSize)
        var successCount = 0
        var failureCount = 0
        
        for (batchIndex, batch) in batches.enumerated() {
            do {
                try await insertPlayerAccoladesBatch(batch, batchIndex: batchIndex + 1, totalBatches: batches.count)
                successCount += batch.count
                logger.debug("Successfully inserted accolades batch \(batchIndex + 1)/\(batches.count) with \(batch.count) records")
            } catch {
                failureCount += batch.count
                logger.error("Failed to insert player accolades batch \(batchIndex + 1): \(error)")
                // Continue with next batch instead of failing completely
            }
        }
        
        self.logger.info("Player accolades batch insert completed: \(successCount) successful, \(failureCount) failed")
    }
    
    private func insertPlayerAccoladesBatch(_ accolades: [PlayerAccolades], batchIndex: Int, totalBatches: Int) async throws {
        try await self.connectionPool.withConnection { connection in
            let sql = """
                INSERT INTO player_accolades (player_id, accolades) VALUES
                """ + accolades.enumerated().map { index, _ in
                    let baseParam = index * 2 + 1
                    return "($\(baseParam), $\(baseParam+1))"
                }.joined(separator: ", ") + """
                ON CONFLICT (player_id) DO UPDATE SET
                    accolades = EXCLUDED.accolades
                """
            
            var bindings: [PostgresData] = []
            
            for accolade in accolades {
                do {
                    let jsonData = try self.jsonEncoder.encode(accolade.accolades)
                    let jsonString = String(data: jsonData, encoding: .utf8)!
                    
                    bindings.append(contentsOf: [
                        PostgresData(int: accolade.player_id),
                        try PostgresData(jsonb: jsonString)
                    ])
                } catch {
                    self.logger.error("Error encoding playerAccolades to JSONB")
                }
            }
            
            return connection.query(sql, bindings).map { _ in }
        }.get()
    }
    
    // MARK: - Lifecycle
    public func close() async throws {
        guard !isClosed else { return }
        
        self.logger.info("Closing DatabaseService")
        isClosed = true
        
        try await self.connectionPool.shutdownAsync()
        try await self.eventLoopGroup.shutdownGracefully()
    }
    
    deinit {
        // Synchronously shutdown the connection pool to satisfy AsyncKit requirements
        // This prevents the assertion failure in EventLoopGroupConnectionPool
        if !isClosed {
            do {
                self.connectionPool.shutdown()
                try self.eventLoopGroup.syncShutdownGracefully()
            } catch {
                // Log error if possible, but we can't throw from deinit
                print("Error during DatabaseService deinit: \(error)")
            }
        }
    }
}
