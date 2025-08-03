public extension Array {
    func chunked(into size: Int) -> [[Element]] {
        stride(from: 0, to: count, by: size).map {
            Array(self[$0..<Swift.min($0 + size, count)])
        }
    }
}

public extension Array where Element == String {
    func firstIndexCaseInsensitive(of element: Element) -> Int? {
        for (index, currentElement) in self.enumerated() {
            if currentElement.caseInsensitiveCompare(element) == .orderedSame {
                return index
            }
        }
        return nil
    }
}