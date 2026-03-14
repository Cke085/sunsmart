# Sun Smart – UV Awareness App

A web-based UV awareness application built with Vue 3, helping young Australians stay sun-safe.

---

## Tech Stack

- **Frontend:** Vue 3 + Vite + Vue Router + Pinia
- **Backend:** Python FastAPI 
- **Database:** MySQL 

---

## Project Structure
```
src/
├── views/                         # One file per page
│   ├── UVView.vue                 # Real-time UV page (home)
│   ├── AwarenessView.vue          # Historical UV & cancer trends
│   └── ClothingView.vue           # Clothing + sunscreen + AI planner
│
├── components/
│   ├── uv/
│   │   ├── UVScaleBar.vue         # Horizontal UV scale with thumb
│   │   ├── UVAlertBar.vue         # Inline sunburn risk alert
│   │   └── UVNotificationBanner.vue # Top-right UV notification banner
│   ├── awareness/
│   │   ├── UVTrendChart.vue       # Annual average max UV chart
│   │   ├── UVHeatmap.vue
│   │   ├── MelanomaTrendChart.vue
│   │   ├── NonMelanomaTrendChart.vue
│   │   ├── RateCompareChart.vue
│   │   └── UVHighDaysChart.vue
│   ├── clothing/
│   │   ├── ClothingRecommendations.vue  # What to wear today
│   │   ├── SunscreenRecommendation.vue  # SPF + 2‑hour reminder toast
│   │   ├── AIDayPlanner.vue             # Structured AI day planner form
│   │   └── clothingCard.vue             # Small card for each clothing item
│   └── shared/
        ├── NavBar.vue             # Top navigation bar
│       └── CTACard.vue            # Reusable CTA card component
│
├── data/
│   ├── mock.js                    # Mock UV + notification copy
│   ├── clothing.js                # Clothing items + badges by UV
│   └── sunburn.js                 # UV → sunburn risk index + time mapping
│
├── stores/
│   ├── counter.js                 # Sample Pinia counter store (template)
│   └── location.js                # Shared reactive location state
│
├── utils/
│   └── parseCSV.js                # CSV helper for awareness charts
│
└── router/
    └── index.js                   # Page routing config
```

---

## Getting Started
### 0. Install Node.js (first time only)
Go to https://nodejs.org and download the **LTS** version, then install it.

Verify it's installed:
```bash
node -v
npm -v
```

Both commands should show a version number before continuing.

### 1. Clone the repository
```bash
git clone https://github.com/Cke085/sunsmart.git
cd sunsmart
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open your browser and go to `http://localhost:5173`

---

## Branch Structure

| Branch | Purpose |
|--------|---------|
| `main` | Stable, working code only |
| `uv-page` | Development for UV page |
| `awareness-page` | Development for Awareness page |
| `clothing-page` | Development for Clothing page |

---

## Daily Workflow

### Before you start working
```bash
git checkout main
git pull
git checkout your-branch-name
```

### After making changes
```bash
git add .
git commit -m "describe what you changed"
git push
```

### Commit message examples
```
feat: add UV level card component
fix: correct scale bar position
style: update navbar layout
```

---

## Contributing Guidelines

- **Never commit directly to `main`**
- Each person works on their own branch
- When your feature is ready, create a Pull Request on GitHub to merge into `main`
- Make sure the app runs without errors before submitting a Pull Request

---

