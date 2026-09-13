# SitePilot AI

## AI-Powered Website Audit and Improvement Recommendation Platform

SitePilot AI is a full-stack web application that audits any website URL and produces an easy-to-understand report showing website quality scores and actionable, AI-style improvement recommendations across performance, SEO, mobile experience, accessibility, usability, and technical quality.

---

## 1. Project Overview

SitePilot AI lets users enter a website URL, runs a heuristic-based audit engine, and presents a comprehensive report with:

- An **overall health score** (0–100) visualized as a circular gauge
- **Six category scores** (Performance, SEO, Mobile, Accessibility, Usability, Technical)
- An **AI executive summary** written in plain language
- **8+ prioritized recommendations** with problem, solution, and expected impact
- **Detailed audit breakdown** with animated progress bars
- **Audit history** saved in the browser's localStorage

The app is designed as a premium SaaS product with a clean, modern interface.

---

## 2. Features

- **Dashboard / Website Audit** — Hero section with URL input, validation, and scanning animation
- **Audit Results** — Full report with score gauge, category cards, executive summary, recommendations, and detailed progress bars
- **Audit History** — List of all past audits stored in localStorage, with view and delete actions
- **Deterministic Scoring** — The same URL always produces the same scores (seeded hash), so results are reproducible
- **Recommendation Engine** — Generates 8+ context-aware recommendations based on which scores are weak
- **Summary Engine** — Writes a human-readable executive summary based on the score profile
- **Export** — Download audit report as a text file
- **Responsive Design** — Works from mobile to desktop
- **No External API Keys Required** — The heuristic engine runs entirely client-side

---

## 3. Architecture

```
project/
├── src/
│   ├── lib/
│   │   ├── types.ts              # TypeScript types and interfaces
│   │   ├── urlUtils.ts           # URL validation, normalization, domain extraction
│   │   ├── scoreUtils.ts         # Score color/label helpers, date formatting
│   │   ├── auditEngine.ts        # Heuristic scoring engine (deterministic)
│   │   ├── recommendationEngine.ts # Generates recommendations from scores
│   │   ├── summaryEngine.ts      # Generates AI-style executive summary
│   │   ├── storage.ts            # localStorage history management
│   │   └── auditService.ts       # Orchestrates audit + storage
│   ├── components/
│   │   ├── Header.tsx            # Top navigation bar
│   │   ├── ScoreGauge.tsx        # Circular SVG score gauge
│   │   ├── ScoreBar.tsx          # Linear progress bar
│   │   ├── CategoryCard.tsx     # Individual category score card
│   │   ├── RecommendationCard.tsx # Single recommendation display
│   │   ├── ScanningOverlay.tsx   # Full-screen scanning animation
│   │   └── EmptyState.tsx        # Empty state placeholder
│   ├── pages/
│   │   ├── Dashboard.tsx         # Landing/audit input page
│   │   ├── AuditResults.tsx     # Full audit report page
│   │   └── AuditHistory.tsx      # History list page
│   ├── App.tsx                  # Root component with view routing
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles + Tailwind
├── server/
│   ├── index.js                 # Express server entry point
│   ├── auditEngine.js           # Server-side audit engine (same heuristic logic)
│   └── package.json             # Server dependencies
└── README.md
```

### Frontend

- **React + Vite + TypeScript** for the SPA
- **Tailwind CSS** for styling
- **Lucide React** for icons
- View routing is handled in `App.tsx` via state (no react-router needed for this MVP)
- Audit results are cached in memory and persisted to localStorage

### Backend

- **Node.js + Express** server providing a `POST /api/audit` endpoint
- Mirrors the same heuristic audit engine as the frontend
- Designed for future integration with real audit tools
- The frontend currently runs audits client-side; the backend is available for when server-side processing is needed

---

## 4. Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 |
| Build Tool | Vite 5 |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Backend Runtime | Node.js |
| Backend Framework | Express 4 |
| Data Storage | localStorage (browser) |

---

## 5. How the Audit Engine Works

The audit engine uses a **deterministic heuristic approach** — no external API keys or network requests are needed.

### Scoring Process

1. **URL Normalization** — The input URL is normalized (adds `https://` if missing) and validated
2. **Seeded Hash** — A hash is computed from the normalized URL string (djb2 algorithm)
3. **Seeded PRNG** — A linear congruential generator (LCG) is seeded with the hash, producing a deterministic random sequence
4. **Category Scoring** — Each of the six categories gets a base score with seeded variance:
   - Performance: base 65–90, adjusted by path depth and HTTPS
   - SEO: base 60–90, adjusted by domain length and TLD
   - Mobile: base 55–90, adjusted by path depth
   - Accessibility: base 50–85
   - Usability: base 62–90
   - Technical: base 58–90, adjusted by HTTPS and TLD
5. **Overall Score** — Weighted average: Performance (20%), SEO (20%), Mobile (20%), Accessibility (15%), Usability (15%), Technical (10%)
6. **Score Clamping** — All scores are clamped to 0–100

### Determinism

The same URL always produces the same scores because the PRNG seed is derived from the URL hash. This makes results reproducible and testable.

### Swappable Architecture

The `runAudit()` function is the single entry point. To replace the heuristic engine with a real audit tool:

```typescript
// Current (heuristic):
export function runAudit(url: string): AuditResult { ... }

// Future (Lighthouse):
export async function runAudit(url: string): Promise<AuditResult> {
  const lighthouseResult = await runLighthouse(url);
  return mapLighthouseToAuditResult(lighthouseResult);
}
```

The return type (`AuditResult`) stays the same, so the UI and storage layers need no changes.

---

## 6. How AI Recommendations Work

The recommendation engine (`recommendationEngine.ts`) contains a library of recommendation templates organized by category and priority.

### Generation Process

1. **Template Library** — 18+ templates across 7 categories (Performance, SEO, Mobile, Accessibility, UX, Conversion, Technical)
2. **Score-Based Selection** — Templates are selected when their corresponding category score falls below a priority-based threshold:
   - High priority templates: triggered when score < 80
   - Medium priority templates: triggered when score < 65
   - Low priority templates: triggered when score < 50
3. **Minimum Guarantee** — If fewer than 8 recommendations are triggered by low scores, additional templates are added using the seeded PRNG to ensure at least 8 recommendations
4. **Priority Sorting** — Recommendations are sorted High → Medium → Low

### Each Recommendation Contains

- **Priority** — High, Medium, or Low
- **Category** — Performance, SEO, Mobile, Accessibility, UX, Conversion, or Technical
- **Problem** — Description of the issue found
- **Solution** — Specific, actionable fix
- **Expected Impact** — What the user gains by implementing the fix

### AI Executive Summary

The summary engine (`summaryEngine.ts`) generates a readable paragraph based on the score profile:

- Opens with an overall health assessment (strong/moderate/weak)
- Identifies the weakest area and its priority
- Notes the second-weakest area if applicable
- Highlights the strongest area
- Closes with the highest-impact actionable items

---

## 7. Future Scope

The architecture is designed for incremental enhancement:

### Real Audit Integration
- **Google Lighthouse** — Replace the heuristic engine with Lighthouse CLI/API calls for real performance, SEO, and accessibility metrics
- **PageSpeed Insights API** — Use Google's API for field data (CrUX) alongside lab data
- **HTML Crawler** — Fetch and parse the actual page HTML to detect missing meta tags, alt text, heading structure, etc.
- **LLM/AI Recommendations** — Send the audit scores and page content to an LLM API (OpenAI, Anthropic) for personalized, context-aware recommendations

### Backend Enhancements
- Database persistence (Supabase/PostgreSQL) for audit history across devices
- User authentication and multi-user support
- Scheduled/recurring audits with email notifications
- PDF report export
- Comparative analysis (track score changes over time)

### Frontend Enhancements
- Real-time crawl progress with WebSocket updates
- Competitor benchmarking
- White-label branding for agencies
- API key management for connected services

---

## Getting Started

### Frontend

```bash
npm install
npm run dev
```

The app runs on the Vite dev server (default: http://localhost:5173).

### Backend (optional)

```bash
cd server
npm install
npm start
```

The Express server runs on http://localhost:3001.

### Build

```bash
npm run build
```

Produces a production build in `dist/`.

---

## License

This is a demo/MVP project. No license restrictions.
