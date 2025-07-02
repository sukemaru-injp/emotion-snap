# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Development Commands

- **Install dependencies**: `pnpm install` (preferred package manager)
- **Start development server**: `pnpm dev` (runs on port 3100)
- **Build for production**: `pnpm build`
- **Run tests**: `pnpm test` (uses Vitest with jsdom environment)
- **Lint and format**: `pnpm check` (runs Biome lint + format + organize
  imports)
- **Generate database types**: `pnpm gen:db-types`

## Architecture Overview

This is a Next.js 15 app using the App Router pattern for an emotion analysis
web application that:

1. **Authenticates users** via Supabase Auth with email confirmation
2. **Manages events** where users can create emotion-based photo contests
3. **Analyzes face emotions** using AWS Rekognition API
4. **Stores photos** in AWS S3 and metadata in Supabase PostgreSQL

### Key Architectural Patterns

- **Server Actions**: All data mutations use Next.js server actions in
  `_actions/` folders
- **Error Handling**: Custom `ServerActionEither<E, T>` type for consistent
  error handling in server actions (similar to Either monad)
- **Type Safety**: Database types auto-generated from Supabase schema in
  `modules/database.types.ts`
- **Route Protection**: Middleware handles Supabase session management across
  all routes
- **Component Organization**:
  - `Container` components handle data fetching and state management
  - `Presenter` components handle UI rendering
  - `_components/` folders contain route-specific components

### External Services Integration

- **Supabase**: Authentication, database, file storage (configured in
  `src/libs/supabase/`)
- **AWS Rekognition**: Face/emotion detection (configured in
  `src/libs/rekognition/`)
- **AWS S3**: Photo storage (configured in `src/libs/s3/`)

### Testing Setup

- Uses Vitest with React Testing Library
- Test files located alongside components in `__tests__/` folders
- Setup file: `src/vitest.setup.ts`
- Tests cover components, utilities, and server action error handling

### Code Style

- Uses Biome for linting/formatting with tab indentation and single quotes
- TypeScript strict mode enabled
- Ant Design components for UI with custom theme in `src/styles/theme.ts`

## Implementation Patterns & Learnings

### Public Event Publishing Feature Implementation

**Context**: Added event publication feature with expiry date functionality
(2025-07-02)

**Key Patterns**:

1. **Server Actions Structure**: Follow existing pattern of server actions in
   `_actions/` folders
   - Use `ServerActionEither<Error, T>` for consistent error handling
   - Import from `@/common/types/ServerActionEither`
   - Always verify user ownership before operations
   - Handle existing records (upsert pattern for publication settings)

2. **Form Dependencies in Ant Design**:
   - Use `Form.Item dependencies={['fieldName']} noStyle` pattern for
     conditional form fields
   - Access field values via `{({ getFieldValue }) => ...}` render prop pattern
   - Enables real-time enable/disable of form fields based on other field values

3. **Data Loading Pattern**:
   - Load initial data in Container component using Promise.all for parallel
     fetching
   - Pass initial data as props to avoid useEffect in client components
   - Handle error cases gracefully with fallback data

4. **Component State Management**:
   - Separate form state (`Form.useForm()`) from display state (`useState`)
   - Update display state after successful server actions
   - Use optimistic updates for better UX

**Files Created/Modified**:

- `publishEvent.ts`: Server actions for publish/unpublish/getPublishedEvent
- `Presenter.tsx`: Added publication form with conditional fields
- `Container.tsx`: Load initial publication data
