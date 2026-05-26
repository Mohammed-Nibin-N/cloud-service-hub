# Implementation Plan: Cloud Service Hub Homepage

## Overview

Build the MVP homepage for the Cloud S
ervice Hub — a React SPA with Vite, TypeScript, Tailwind CSS v3, and React Router v6. The implementation delivers a dark-themed dashboard with a header, responsive service card grid, and client-side navigation to a Data Upload Access Request page.

## Tasks

- [ ] 1. Set up frontend project structure and tooling
  - [x] 1.1 Initialize Vite + React + TypeScript project
    - Run `npm create vite@latest` with React + TypeScript template inside the `frontend/` directory
    - Install dependencies: `react`, `react-dom`, `react-router-dom`
    - Install dev dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`
    - Create `tsconfig.json` with strict mode enabled
    - _Requirements: 7.3, 7.4, 7.5_

  - [ ] 1.2 Configure Tailwind CSS and dark theme
    - Initialize Tailwind with `npx tailwindcss init -p`
    - Configure `tailwind.config.js` with content paths and custom color palette (navy-900: #0a1628, navy-800: #1e3a5f, navy-700: #2a3a5c, primary-500: #3b82f6, primary-600: #2563eb, accent-400: #fbbf24, accent-500: #f59e0b)
    - Add Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) to the main CSS file
    - _Requirements: 5.1, 5.3, 5.4, 7.4_

  - [ ] 1.3 Create directory structure and entry files
    - Create `frontend/src/pages/`, `frontend/src/components/`, `frontend/src/routes/` directories
    - Create `frontend/src/main.tsx` entry point that renders `App`
    - Create `frontend/src/App.tsx` that renders the `RouterProvider`
    - Create `frontend/index.html` with `<noscript>` fallback message
    - _Requirements: 7.1, 7.2, 7.6_

  - [x] 1.4 Configure Vitest for testing
    - Add Vitest configuration in `vite.config.ts` with jsdom environment
    - Create test setup file with `@testing-library/jest-dom` matchers
    - Add test script to `package.json`
    - Create `frontend/tests/` directory structure: `tests/components/`, `tests/pages/`, `tests/integration/`
    - _Requirements: 7.2_

- [ ] 2. Implement reusable components
  - [ ] 2.1 Implement Layout component
    - Create `frontend/src/components/Layout.tsx`
    - Apply dark background (`bg-navy-900`), min-height full screen, max-width container, centered content
    - Render `<Outlet />` from React Router for nested page content
    - Apply consistent padding and text color (`text-slate-200`)
    - _Requirements: 5.1, 5.2, 6.4_

  - [ ] 2.2 Implement Header component
    - Create `frontend/src/components/Header.tsx`
    - Accept `title` and `subtitle` props
    - Render title in an `<h1>` element with large font size
    - Render subtitle in a `<p>` element below the title
    - Apply consistent typography (max 3 font sizes, 2 font weights) and spacing
    - Ensure minimum 16px text size and left-alignment
    - _Requirements: 1.1, 1.2, 1.3, 5.4, 6.4_

  - [ ] 2.3 Implement ServiceCard component
    - Create `frontend/src/components/ServiceCard.tsx`
    - Accept props: `title`, `description`, `isActive`, `navigateTo?`
    - When `isActive` is true: render as a React Router `<Link>` with pointer cursor, hover elevation/shadow effect, keyboard focusability (Enter/Space activation), visible focus ring
    - When `isActive` is false: render as a static `<div>` with "Coming Soon" label (gold accent), default cursor, no hover effects, no click behavior
    - Apply card background color (`bg-navy-800`) with border for visual separation from page background
    - Ensure text contrast ratio ≥ 4.5:1 for body text
    - _Requirements: 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 5.3, 5.5_

  - [ ] 2.4 Implement ServiceCardGrid component
    - Create `frontend/src/components/ServiceCardGrid.tsx`
    - Accept `services` array prop
    - Render a CSS grid with responsive Tailwind classes: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
    - Map over services and render a `ServiceCard` for each
    - Apply gap spacing between cards
    - _Requirements: 2.1, 2.5, 6.1, 6.2, 6.3, 6.5_

- [ ] 3. Implement page components and routing
  - [ ] 3.1 Implement HomePage
    - Create `frontend/src/pages/HomePage.tsx`
    - Define static services array with three services: "Data Upload Access" (active, navigates to `/data-upload-access`), "Database Access" (placeholder), "New Environment Setup" (placeholder)
    - Render `Header` with title "Cloud Service Hub" and subtitle "Self-service portal for cloud and DevOps capabilities"
    - Render `ServiceCardGrid` with the services array
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_

  - [ ] 3.2 Implement DataUploadAccessPage
    - Create `frontend/src/pages/DataUploadAccessPage.tsx`
    - Display title "Data Upload Access Request" in an `<h1>`
    - Display subtitle "Configure upload access and processing requirements" below the title
    - Provide a back-navigation link (React Router `<Link>`) to the homepage (`/`)
    - Apply same dark theme styling as homepage
    - _Requirements: 4.3, 4.4, 4.5, 5.2_

  - [ ] 3.3 Implement ErrorPage
    - Create `frontend/src/pages/ErrorPage.tsx`
    - Display user-friendly error message indicating the page could not be loaded
    - Provide a link back to the homepage
    - Use `useRouteError` from React Router to access error details
    - _Requirements: 4.7_

  - [ ] 3.4 Configure React Router routes
    - Create `frontend/src/routes/index.tsx`
    - Define route configuration with `createBrowserRouter`: root path `/` with `Layout` element and `ErrorPage` as errorElement, index route for `HomePage`, `/data-upload-access` route for `DataUploadAccessPage`
    - Wire router into `App.tsx` via `RouterProvider`
    - _Requirements: 4.1, 4.2, 7.5_

- [ ] 4. Checkpoint - Verify build and manual review
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Write unit tests for components
  - [ ]* 5.1 Write unit tests for Header component
    - Verify title renders as `<h1>` element
    - Verify subtitle renders below the title
    - Verify correct text content is displayed
    - _Requirements: 1.1, 1.2_

  - [ ]* 5.2 Write unit tests for ServiceCard component
    - Test active card: renders title, description, pointer cursor class, hover effect classes, keyboard focusability, navigates on click
    - Test placeholder card: renders title, description, "Coming Soon" label, no pointer cursor, no navigation on click
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

  - [ ]* 5.3 Write unit tests for ServiceCardGrid component
    - Verify correct number of cards rendered (3)
    - Verify cards render in correct order
    - _Requirements: 2.1_

  - [ ]* 5.4 Write unit tests for DataUploadAccessPage
    - Verify title "Data Upload Access Request" renders
    - Verify subtitle renders
    - Verify back link to homepage exists
    - _Requirements: 4.3, 4.4, 4.5_

  - [ ]* 5.5 Write unit tests for ErrorPage
    - Verify error message renders
    - Verify home link exists
    - _Requirements: 4.7_

- [ ] 6. Write integration tests for navigation
  - [ ]* 6.1 Write navigation integration tests
    - Test clicking "Data Upload Access" card navigates to `/data-upload-access`
    - Test clicking placeholder cards does not change route
    - Test back link on Data Upload page returns to `/`
    - Test navigating to unknown route shows error page
    - _Requirements: 4.1, 4.2, 4.7_

- [ ] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- No property-based tests are included as the design explicitly states PBT is not applicable for this UI-focused feature
- Unit tests validate component rendering and behavior
- Integration tests validate routing and navigation flows
- The design specifies TypeScript throughout — all components use `.tsx` extension

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "2.2"] },
    { "id": 3, "tasks": ["2.3", "2.4"] },
    { "id": 4, "tasks": ["3.1", "3.2", "3.3"] },
    { "id": 5, "tasks": ["3.4"] },
    { "id": 6, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5"] },
    { "id": 7, "tasks": ["6.1"] }
  ]
}
```
