---
name: iOS App Project Setup
description: Core facts about the dribblio iOS app — location, tooling, deployment target, and dependencies
type: project
---

The iOS app lives at `apps/ios/` within the monorepo. It was scaffolded with XcodeGen from `apps/ios/project.yml`.

- Product name: `dribblio`, bundle ID: `io.dribbl.app`
- Minimum deployment: iOS 26.0, iPhone only (`TARGETED_DEVICE_FAMILY: "1"`)
- Swift 6.0, SwiftUI interface
- SPM dependency: `socket.io-client-swift` (resolves to 16.1.1 + Starscream 4.0.8)
- Test target `dribblio-tests` uses Swift Testing (not XCTest)
- `BACKEND_URL` in `Info.plist` is driven by build config via `BACKEND_URL_VALUE` xcconfig setting: `http://localhost:3001` (Debug), `https://api.dribbl.io` (Release)
- Config files at `apps/ios/Configs/Debug.xcconfig` and `Configs/Release.xcconfig` (currently empty placeholders)
- Available simulator: iPhone 17 / iOS 26.4 (no iPhone 16 — Xcode 26 beta ships 17-series)

**Why:** iOS client being added to the existing NestJS + React web monorepo.
**How to apply:** When working on iOS features, use `apps/ios/project.yml` as the source of truth for build settings. Re-run `xcodegen generate` inside `apps/ios/` after any structural changes (new targets, new SPM packages, new source groups).
