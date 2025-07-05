# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added validation for event publication expiry dates to limit selection to today through 1 week from today
- Added proper data fetching from `public_event` table for public event pages
- Added guards for non-existent and expired events on public event pages

### Changed
- Modified public event page (`/public/event/[id]`) to fetch data from `public_event` table instead of `event` table
- Updated public event page to display event expiry information
- Enhanced event publication form with date range validation (today to 1 week maximum)
- Added comprehensive validation both in UI (DatePicker) and form submission for expiry dates

### Fixed
- Fixed public event page to properly handle expired events and display appropriate messages
- Added proper error handling for non-existent public events