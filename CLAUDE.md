# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start dev server on port 3000 (auto-opens browser)
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # ESLint with strict mode (0 warnings allowed)
```

## Tech Stack

- **React 18.2** with Vite 5.0
- **CSS-in-JS** via tagged template literals (no Tailwind despite being installed)
- **Thai localization** - all UI text in Thai, number formatting via `Intl.NumberFormat('th-TH')`

## Architecture

This is a **single-file React application** - the entire app lives in `src/App.jsx` (~1600 lines):
- Custom form components (NumberInput, Select, Toggle, Slider, Toast) defined inline
- ~760 lines of embedded CSS using tagged template literals
- URL-based state management via URLSearchParams for shareable calculator links
- All calculation logic, styling, and UI in one file

### State Management

- Individual `useState` hooks for each form field
- `useMemo` for expensive payment schedule calculations
- URL synchronization: state changes update URL params, page load parses URL params

### Component Pattern

```jsx
// Compound component pattern used for Field:
const Field = ({ children }) => (...)
Field.Label = ({ children }) => (...)
Field.Control = ({ children }) => (...)
```

## Financial Calculations

Uses Thai standard **flat rate interest** (not compound):
- Total interest: `Principal × Rate × Years`
- Monthly payment: `(Principal + Interest) / Months`
- Insurance depreciation: 10% annual reduction via `Math.pow(0.9, year - 1)`

## Key Features

- 10 URL parameters track calculator state for sharing
- Print-optimized styles with light theme override
- Native Share API with clipboard fallback
- Responsive: sidebar layout on desktop, stacked on mobile (breakpoints: 1024px, 768px, 640px)
