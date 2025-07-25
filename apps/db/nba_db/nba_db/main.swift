import ArgumentParser
import Foundation
import Darwin

@available(macOS 10.15, *)
struct NBADB: AsyncParsableCommand {
  static let configuration = CommandConfiguration(
    abstract: "NBA Database Management Tool",
    subcommands: [
      PopulateCommand.self,
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
