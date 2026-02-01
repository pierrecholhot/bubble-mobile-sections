# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.2] - 2026-02-01

### Added

- Add active section indicator to navigation bar

### Changed

- Bump lint-staged from 15.5.2 to 16.2.7 (#4)
- Bump globals from 17.1.0 to 17.2.0 in the dev-dependencies group (#3)
- Bump actions/setup-node from 4 to 6 (#2)

## [2.0.1] - 2026-02-01

### Fixed

- Fixed version not being updated in build output

## [2.0.0] - 2026-02-01

### Changed

- **BREAKING:** Config API renamed from `window.bmsConfig` to `window.BubbleMobileSections.config`
- Config now loads at init time, allowing overrides set after plugin load
- Version now logged to console on load

## [1.0.0] - 2026-01-31

### Added

- Initial release
