# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added EmptyState component for consistent empty state handling across the application
- Added empty state display when no Event Images are uploaded with informative messaging
- Added emotion ranking system with fullscreen modal interface in ImagesPresenter
- Added ranking button with trophy icon to display emotion-based rankings
- Added sortable emotion scoring system for 5 emotion types (Happy, Angry, Sad, Smile, Surprised)
- Added Happy+Smile combined scoring option for ranking system
- Added special UI styling for top 3 rankings with distinct icons and visual effects:
  - 1st place: Gold crown icon with golden border and shadow
  - 2nd place: Silver trophy icon with silver border  
  - 3rd place: Bronze star icon with bronze border
- Added CSS Module-based styling system in `_components/_styles` directory
- Added validation for event publication expiry dates to limit selection to today through 1 week from today
- Added proper data fetching from `public_event` table for public event pages
- Added guards for non-existent and expired events on public event pages
- Added conditional QR code display based on event publication status

### Changed
- Modified ImagesPresenter to disable "View Ranking" button when no images are available
- Enhanced RankingModal to show empty state when no photos have emotion data
- Replaced `@ant-design/icons` with `react-icons` for better icon management
- Migrated global CSS styles to local CSS Modules (removed !important usage)
- Enhanced ImagesPresenter with real-time emotion score sorting and ranking display
- Refactored ranking functionality into separate RankingModal component for better code organization and reusability
- Modified public event page (`/public/event/[id]`) to fetch data from `public_event` table instead of `event` table
- Updated public event page to display event expiry information
- Enhanced event publication form with date range validation (today to 1 week maximum)
- Added comprehensive validation both in UI (DatePicker) and form submission for expiry dates
- Modified QRCodeCard component to show informational message when event is not published

### Fixed
- Fixed public event page to properly handle expired events and display appropriate messages
- Added proper error handling for non-existent public events

### Enhanced
- **Optimized ranking system performance with improved useMemo usage:**
  - Separated data processing into two optimized useMemo hooks for better performance
  - Reduced unnecessary re-computations when only score type changes
  - Improved component re-rendering efficiency
- **Improved public event UI (`/public/event/[id]`) for mobile-first user experience:**
  - Added warm orange gradient background for friendly atmosphere
  - Implemented card-based layout with rounded corners and shadows
  - Added section icons (user, camera, upload) for better visual hierarchy
  - Enlarged camera component for mobile devices (350px max width, 450px height)
  - Enhanced submit button with large touch-friendly design (300px max width, 56px height)
  - Added conditional button activation (requires both name and photo)
  - Implemented Japanese UI text with helpful guidance messages
  - Added styled error display with warning icons
  - Improved photo preview with completion message and rounded corners
- **Refactored public event Presenter component to use CSS Modules:**
  - Created `_styles/Presenter.module.css` with 12 style classes for better organization
  - Replaced all inline styles with CSS Module classes for improved maintainability
  - Removed unused theme imports and dependencies
  - Improved code consistency with existing CSS Module patterns (matching RankingModal structure)
  - Enhanced type safety and prevented style-related typos through modular CSS approach