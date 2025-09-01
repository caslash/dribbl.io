import ArgumentParser
import Foundation
import NBAKit

struct Retry: AsyncParsableCommand {
    static let configuration = CommandConfiguration(
        commandName: "retry"
    )
    @Argument(help: "The name of the database to insert into.")
    var database: String

    @Argument(help: "The username of the database to insert into.")
    var username: String

    @Argument(help: "The password of the database to insert into.")
    var password: String

    func run() async throws {
        let config = DatabaseConfig(
            database: self.database,
            username: self.username,
            password: self.password
        )

        let databaseService = try DatabaseService(config: config)
        let existingIds: [Int] = try await databaseService.getExistingPlayerIds()
        let retryIds = PlayersList.allPlayers.filter { return !existingIds.contains($0.id) }
        
        let dataProcessor = try DataProcessor(
            fetchConcurrency: 30, batchSize: 100, databaseConfig: config)
        
        let _ = try await dataProcessor.processPlayers(retryIds)
    }
}
