# Documentation

This directory contains project documentation.

## Architectural Patterns

### Container/Presenter Pattern

This pattern separates concerns between data fetching/logic and UI presentation.

- **Container Components:**
  - Responsible for fetching data (e.g., using API calls like `getEvents`) and
    handling application logic.
  - Pass necessary data and callbacks down to Presenter components via props.
  - Example: `src/app/mypage/_components/Container.tsx`

- **Presenter Components:**
  - Focus solely on the UI and how data is presented.
  - Receive data and callbacks as props from their corresponding Container
    component.
  - Render the UI based on the received props.
  - Often "dumb" components without their own state or data-fetching logic.
  - Example: `src/app/mypage/_components/Presenter.tsx`
