# Habit Tracker PWA

A high-performance, offline-first Habit Tracking application built with Next.js and TypeScript. This project was developed as a technical assessment focusing on state management, PWA architecture, and rigorous testing.

## 🚀 Key Features

- **Sequential Streak Calculation**: Advanced algorithm that calculates consecutive completion streaks based on calendar dates.
- **Offline-First Architecture**: Service Worker integration ensures the app remains fully functional without an internet connection.
- **PWA Ready**: Fully installable on Desktop and Mobile with a standard-compliant `manifest.json`.
- **Zero-Latency Persistence**: 100% LocalStorage-based persistence with a custom safety layer for data integrity.
- **Simulated Auth**: Secure-by-design authentication flow with session persistence and user-isolated habit data.

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **State & Storage** | Custom LocalStorage Abstraction Layer |
| **PWA** | Service Worker API & Web App Manifest |
| **Unit Testing** | Vitest (JSDOM environment) |
| **E2E Testing** | Playwright |

## 🏗 Architecture

### Persistence Layer
The application utilizes a custom `Storage` abstraction located in `src/lib/storage.ts`. This layer ensures that all data (Users, Habits, Sessions) is sanitized and safely parsed from `localStorage`. It handles environment checks (SSR vs Client) to prevent hydration mismatches and provides a unified interface for the rest of the app.

### Service Worker Strategy
The Service Worker (`public/sw.js`) implements a "Network First, Falling Back to Cache" strategy for navigation requests.
- **App Shell**: Critical routes (`/`, `/login`, `/signup`, `/dashboard`) are pre-cached during the `install` phase.
- **On-Demand Caching**: Next.js static chunks and assets are cached as they are fetched, ensuring the UI remains available offline even for previously unvisited pages.
- **Background Sync**: SW registration is optimized to not block initial page rendering while still ensuring background asset preparation.

### Streak Algorithm
The streak engine performs backward date traversal. It anchors on the current date and iterates through a sorted, unique set of completion timestamps to determine the current consecutive run, ensuring accurate reporting across timezones and date boundaries.

## ⚙️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

## 🧪 Running Tests

The project maintains high standards of code quality through a dual-testing strategy.

### Unit & Integration Tests (Vitest)
Targets 80%+ coverage for core logic and component interactions.
```bash
# Run all vitest tests
npm run test:unit

# Run with coverage report
npm run test:unit -- --coverage
```

### End-to-End Tests (Playwright)
Validates critical user journeys, including authentication flows and PWA offline behavior.
```bash
# Run all e2e tests
npm run test:e2e

# Run with UI mode
npx playwright test --ui
```

## 🌐 Deployment

This application is optimized for deployment on **Vercel** or **Netlify**. Since it relies on client-side persistence (LocalStorage), it requires no external database setup. Ensure that the deployment platform handles the static generation and caching headers correctly to support the PWA features.
