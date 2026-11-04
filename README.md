# WebMetric: Website Performance & Core Vitals Analyzer

**WebMetric** is an automatic website analysis application built with **Next.js** and **Tailwind CSS**. It evaluates target webpages for Core Web Vitals, SEO optimization state, Accessibility constraints, and Server response headers.

## 🚀 Key Features

1. **Dual-Scan Analysis Engine**:
   - **Local Crawler**: High-speed server-side HTML parser scraping DOM density, heading trees, semantic landmark usage, missing `alt` images tags, and security protocols in <1s.
   - **Chrome PageSpeed Auditing**: Contacts Google's official PageSpeed Insights API in parallel to query real Chrome User Experience metrics (CrUX) and Lighthouse diagnostics.
2. **Visual Core Web Vitals Dials**:
   - Displays circles for Performance, Accessibility, Best Practices, and SEO.
   - Outputs Web Vitals metrics including **LCP** (Largest Contentful Paint), **FCP** (First Contentful Paint), and **CLS** (Cumulative Layout Shift) with color-coded alerts (Good / Moderate / Poor).
3. **Resilient Local Mock Simulation**:
   - Includes automatic network throttling emulation fallback. If Google's external API is down or blocked, WebMetric calculates estimated loading times (TTFB, script weight payloads) and mock diagnostics based on DOM payload attributes, ensuring the UI is never empty.
4. **Interactive Network Connection Throttler**:
   - Test webpage performance under emulated connection baselines: Slow 3G, Fast 3G, High-speed 4G, and fiber Broadband.
5. **SEO & Social Snippet Simulator**:
   - Visual mock preview displaying how the website renders on Google search queries (SERP) and OpenGraph card feeds (Facebook/X headers).
6. **Local Comparison Mode**:
   - Saves historical inspections inside browser `localStorage`. Allows users to compare two scanned domains side-by-side.

---

## 🛠️ Project Structure

- `app/api/analyze/route.ts`: Contains local scraping routines and Pagespeed endpoints parsing fallback logic.
- `app/page.tsx`: Contains the React dashboard incorporating the tabs, progress indicators, gauges, simulators, and comparisons.
- `app/globals.css`: Customized dark-themed gradients, progress variables, and keyframe animations.
- `app/layout.tsx`: General next-app layout config.

---

## 💻 Developers Getting Started

First, install the packages:
```bash
npm install
```

Then launch the local workspace server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application workspace.
