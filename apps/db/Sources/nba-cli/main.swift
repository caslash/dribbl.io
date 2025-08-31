import ArgumentParser
import Darwin
import Foundation

@available(macOS 10.15, *)
struct NBADB: AsyncParsableCommand {
    static let configuration = CommandConfiguration(
        abstract: "NBA Database Management Tool",
        subcommands: [
            Populate.self,
            Retry.self,
        ]
    )

    func run() async throws {
        print("Use --help for available commands")
    }
}

let task = Task {
    await NBADB.main()
}

await task.value
