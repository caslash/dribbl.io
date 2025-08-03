public extension Int {
    init?(from optionalString: String?) {
        guard let raw = optionalString?.trimmingCharacters(in: .whitespacesAndNewlines),
              !raw.isEmpty,
              let value = Int(raw)
        else {
            return nil
        }
        
        self = value
    }
}