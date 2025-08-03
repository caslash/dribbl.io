import ArgumentParser
import Foundation
import NBAKit

struct Populate: AsyncParsableCommand {
    static let configuration = CommandConfiguration(
        commandName: "populate"
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
        
        let dataProcessor = try DataProcessor(databaseConfig: config)
        let _ = try await dataProcessor.processPlayers(PlayersList.allPlayers)
    }
}
