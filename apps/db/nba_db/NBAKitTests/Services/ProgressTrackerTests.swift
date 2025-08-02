import Testing
import Foundation
@testable import NBAKit

@Suite("ProgressTracker Tests")
struct ProgressTrackerTests {
    
    // MARK: - Initialization Tests
    
    @Test("Initialize ProgressTracker with correct initial state")
    func initialization() async {
        let tracker = ProgressTracker(total: 100)
        let summary = await tracker.getFinalSummary()
        
        #expect(summary.totalPlayers == 100)
        #expect(summary.completed == 0)
        #expect(summary.failed == 0)
        #expect(summary.errors.isEmpty)
        #expect(summary.totalTime >= 0) // Should have non-negative elapsed time
    }
    
    // MARK: - Update Progress Tests
    
    @Test("Update progress with default increment")
    func updateProgressWithDefaultIncrement() async {
        let tracker = ProgressTracker(total: 10)
        
        await tracker.updateProgress()
        let summary = await tracker.getFinalSummary()
        
        #expect(summary.completed == 1)
        #expect(summary.failed == 0)
    }
    
    @Test("Update progress with custom increment")
    func updateProgressWithCustomIncrement() async {
        let tracker = ProgressTracker(total: 100)
        
        await tracker.updateProgress(5)
        let summary = await tracker.getFinalSummary()
        
        #expect(summary.completed == 5)
        #expect(summary.failed == 0)
    }
    
    @Test("Multiple progress updates accumulate correctly")
    func multipleProgressUpdates() async {
        let tracker = ProgressTracker(total: 100)
        
        await tracker.updateProgress(10)
        await tracker.updateProgress(20)
        await tracker.updateProgress()
        
        let summary = await tracker.getFinalSummary()
        #expect(summary.completed == 31) // 10 + 20 + 1
        #expect(summary.failed == 0)
    }
    
    // MARK: - Error Recording Tests
    
    @Test("Record single error")
    func recordSingleError() async {
        let tracker = ProgressTracker(total: 10)
        let testError = NSError(domain: "TestError", code: 404, userInfo: [NSLocalizedDescriptionKey: "Player not found"])
        
        await tracker.recordError(playerId: 123, error: testError)
        let summary = await tracker.getFinalSummary()
        
        #expect(summary.completed == 0)
        #expect(summary.failed == 1)
        #expect(summary.errors.count == 1)
        #expect(summary.errors[123] != nil)
        #expect((summary.errors[123] as NSError?)?.code == 404)
    }
    
    @Test("Record multiple errors")
    func recordMultipleErrors() async {
        let tracker = ProgressTracker(total: 100)
        let error1 = NSError(domain: "TestError", code: 404, userInfo: [:])
        let error2 = NSError(domain: "TestError", code: 500, userInfo: [:])
        
        await tracker.recordError(playerId: 123, error: error1)
        await tracker.recordError(playerId: 456, error: error2)
        
        let summary = await tracker.getFinalSummary()
        #expect(summary.failed == 2)
        #expect(summary.errors.count == 2)
        #expect(summary.errors[123] != nil)
        #expect(summary.errors[456] != nil)
    }
    
    @Test("Record error overwrites same player ID")
    func recordErrorOverwritesSamePlayerId() async {
        let tracker = ProgressTracker(total: 10)
        let error1 = NSError(domain: "TestError", code: 404, userInfo: [:])
        let error2 = NSError(domain: "TestError", code: 500, userInfo: [:])
        
        await tracker.recordError(playerId: 123, error: error1)
        await tracker.recordError(playerId: 123, error: error2)
        
        let summary = await tracker.getFinalSummary()
        #expect(summary.failed == 2) // Failed count should increment
        #expect(summary.errors.count == 1) // But only one error stored per player
        #expect((summary.errors[123] as NSError?)?.code == 500) // Latest error wins
    }
    
    // MARK: - Mixed Progress and Error Tests
    
    @Test("Mixed progress updates and error recording")
    func mixedProgressAndErrors() async {
        let tracker = ProgressTracker(total: 100)
        let testError = NSError(domain: "TestError", code: 404, userInfo: [:])
        
        await tracker.updateProgress(30)
        await tracker.recordError(playerId: 123, error: testError)
        await tracker.updateProgress(20)
        await tracker.recordError(playerId: 456, error: testError)
        
        let summary = await tracker.getFinalSummary()
        #expect(summary.completed == 50)
        #expect(summary.failed == 2)
        #expect(summary.errors.count == 2)
        #expect(summary.totalPlayers == 100)
    }
    
    // MARK: - Final Summary Calculation Tests
    
    @Test("Average rate calculation with processing time")
    func averageRateCalculation() async {
        let tracker = ProgressTracker(total: 100)
        
        // Process some items
        await tracker.updateProgress(25)
        await tracker.recordError(playerId: 123, error: NSError(domain: "Test", code: 1, userInfo: [:]))
        
        // Add a small delay to ensure time passes
        try? await Task.sleep(nanoseconds: 100_000_000) // 0.1 seconds
        
        let summary = await tracker.getFinalSummary()
        
        #expect(summary.completed == 25)
        #expect(summary.failed == 1)
        #expect(summary.totalTime > 0)
        #expect(summary.averageRate > 0)
        
        // Verify rate calculation: (completed + failed) / totalTime
        let expectedRate = Double(summary.completed + summary.failed) / summary.totalTime
        #expect(abs(summary.averageRate - expectedRate) < 0.001)
    }
    
    @Test("Zero time handling")
    func zeroTimeHandling() async {
        let tracker = ProgressTracker(total: 10)
        
        // Get summary immediately without any processing time
        let summary = await tracker.getFinalSummary()
        
        // Even with zero processing, should handle gracefully
        #expect(summary.averageRate == 0)
        #expect(summary.completed == 0)
        #expect(summary.failed == 0)
    }
    
    // MARK: - ProcessingSummary Tests
    
    @Test("ProcessingSummary properties initialization")
    func processingSummaryProperties() {
        let errors: [Int: Error] = [123: NSError(domain: "Test", code: 404, userInfo: [:])]
        let summary = ProcessingSummary(
            totalPlayers: 100,
            completed: 80,
            failed: 20,
            errors: errors,
            totalTime: 120.5,
            averageRate: 0.83
        )
        
        #expect(summary.totalPlayers == 100)
        #expect(summary.completed == 80)
        #expect(summary.failed == 20)
        #expect(summary.errors.count == 1)
        #expect(summary.totalTime == 120.5)
        #expect(summary.averageRate == 0.83)
    }
    
    // MARK: - String Extension Tests
    
    @Test("String repeating extension")
    func stringRepeatingExtension() {
        #expect("a".repeating(0) == "")
        #expect("a".repeating(1) == "a")
        #expect("a".repeating(3) == "aaa")
        #expect("hello".repeating(2) == "hellohello")
        #expect("█".repeating(5) == "█████")
    }
    
    // MARK: - Edge Cases
    
    @Test("Progress exceeds total")
    func progressExceedsTotal() async {
        let tracker = ProgressTracker(total: 10)
        
        await tracker.updateProgress(15) // Exceed total
        let summary = await tracker.getFinalSummary()
        
        #expect(summary.completed == 15)
        #expect(summary.totalPlayers == 10)
        // Should handle gracefully without crashing
    }
    
    @Test("Zero total handling")
    func zeroTotal() async {
        let tracker = ProgressTracker(total: 0)
        
        await tracker.updateProgress(1)
        let summary = await tracker.getFinalSummary()
        
        #expect(summary.totalPlayers == 0)
        #expect(summary.completed == 1)
        // Should handle gracefully
    }
    
    @Test("Negative player ID handling")
    func negativePlayerId() async {
        let tracker = ProgressTracker(total: 10)
        let testError = NSError(domain: "Test", code: 404, userInfo: [:])
        
        await tracker.recordError(playerId: -1, error: testError)
        let summary = await tracker.getFinalSummary()
        
        #expect(summary.failed == 1)
        #expect(summary.errors[-1] != nil)
    }
    
    // MARK: - Performance Tests
    
    @Test("Performance with many updates", .timeLimit(.minutes(1)))
    func performanceWithManyUpdates() async {
        let tracker = ProgressTracker(total: 10000)
        
        let startTime = Date()
        
        for i in 0..<1000 {
            if i % 10 == 0 {
                await tracker.recordError(playerId: i, error: NSError(domain: "Test", code: 404, userInfo: [:]))
            } else {
                await tracker.updateProgress()
            }
        }
        
        let endTime = Date()
        let elapsed = endTime.timeIntervalSince(startTime)
        
        // Should complete within reasonable time (less than 5 seconds)
        #expect(elapsed < 5.0)
        
        let summary = await tracker.getFinalSummary()
        #expect(summary.completed == 900) // 1000 - 100 errors
        #expect(summary.failed == 100)
        #expect(summary.errors.count == 100)
    }
}