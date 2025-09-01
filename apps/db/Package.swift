// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "nba-cli",
    platforms: [
        .macOS(.v14)
    ],
    products: [
        .executable(
            name: "nba-cli",
            targets: ["nba-cli"]
        ),
        .library(
            name: "NBAKit",
            targets: ["NBAKit"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-argument-parser.git", from: "1.6.1"),
        .package(url: "https://github.com/vapor/postgres-kit.git", from: "2.14.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.6.4"),
        .package(url: "https://github.com/apple/swift-async-algorithms.git", from: "1.0.4"),
        .package(url: "https://github.com/apple/swift-algorithms.git", from: "1.2.1")
    ],
    targets: [
        .executableTarget(
            name: "nba-cli",
            dependencies: [
                "NBAKit",
                .product(name: "ArgumentParser", package: "swift-argument-parser")
            ],
            path: "Sources/nba-cli"
        ),
        .target(
            name: "NBAKit",
            dependencies: [
                .product(name: "PostgresKit", package: "postgres-kit"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "AsyncAlgorithms", package: "swift-async-algorithms"),
                .product(name: "Algorithms", package: "swift-algorithms")
            ],
            path: "Sources/NBAKit"
        ),
        .testTarget(
            name: "NBAKitTests",
            dependencies: ["NBAKit"],
            path: "Tests/NBAKitTests",
            resources: [
                .process("Resources")
            ]
        )
    ]
)