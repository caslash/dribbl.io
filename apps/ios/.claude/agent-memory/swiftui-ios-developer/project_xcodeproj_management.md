---
name: Xcode project file management for new Swift files
description: New Swift files must be manually registered in project.pbxproj — they are not auto-discovered
type: project
---

New `.swift` files written to disk are NOT automatically included in the Xcode build. They must be registered in `dribblio.xcodeproj/project.pbxproj` in three places:

1. **PBXBuildFile section** — maps a build file UUID to a file reference UUID
2. **PBXFileReference section** — declares the file path and type
3. **PBXGroup section** — places the file in the correct navigator group (CareerPath, Draft, DailyRoster, Root, Shared, ViewModels, etc.)
4. **PBXSourcesBuildPhase section** (`451EBAFC7E90CAB3A75A9578`) — adds the build file UUID to the compile sources list

The project also has an Xcode linter/formatter that auto-applies `nonisolated(unsafe)` and `MainActor.assumeIsolated` patterns — after writing to a ViewModel, re-read it before making further edits as the linter may have restructured the file.

**Why:** The project uses a classic `.xcodeproj` with manually managed file references, not a package-based or folder-reference approach.

**How to apply:** After writing any new `.swift` file, check whether it appears in `project.pbxproj`. If not, add PBXBuildFile + PBXFileReference + PBXGroup + PBXSourcesBuildPhase entries with unique 24-char hex UUIDs before attempting a build.
