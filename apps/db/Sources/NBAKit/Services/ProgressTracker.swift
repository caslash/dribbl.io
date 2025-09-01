import Foundation

public class ProgressTracker {
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
    
    public func updateProgress(_ increment: Int = 1) async {
        self.completed += increment
        await displayProgress()
    }
    
    public func recordError(playerId: Int, error: Error) async {
        self.failed += 1
        self.errors[playerId] = error
        await displayProgress()
    }
    
    public func getFinalSummary() async -> ProcessingSummary {
        let elapsed = Date().timeIntervalSince(self.startTime)
        let totalProcessed = self.completed + self.failed
        let rate = elapsed > 0 ? Double(totalProcessed) / elapsed : 0
        
        return ProcessingSummary(
            totalPlayers: self.total,
            completed: self.completed,
            failed: self.failed,
            errors: self.errors,
            totalTime: elapsed,
            averageRate: rate
        )
    }
    
    private func displayProgress() async {
        let now = Date()
        
        guard now.timeIntervalSince(self.lastUpdateTime) >= 0.1 else { return }
        self.lastUpdateTime = now
        
        let totalProcessed = self.completed + self.failed
        let percentage = totalProcessed > 0 ? Double(totalProcessed) / Double(total) * 100 : 0
        let elapsed = now.timeIntervalSince(self.startTime)
        let rate = elapsed > 0 ? Double(totalProcessed) / elapsed : 0
        let eta = rate > 0 ? (Double(self.total - totalProcessed) / rate) : 0
        
        let barWidth = 40
        let filledWidth = Int(Double(barWidth) * percentage / 100)
        let bar = String(repeating: "█", count: filledWidth) + String (repeating: "░", count: barWidth - filledWidth)
        
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
