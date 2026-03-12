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
├── views/                   # One file per page
│   ├── UVView.vue            # UV page (home)
│   ├── AwarenessView.vue     # Awareness page
│   └── ClothingView.vue      # Clothing page
│
├── components/
│   ├── layout/
│   │   └── NavBar.vue        # Top navigation bar
│   ├── uv/                   # Components for UV page
│   ├── awareness/            # Components for Awareness page
│   ├── clothing/             # Components for Clothing page
│   └── shared/               # Reusable components (e.g. CTACard)
│
├── data/
│   └── mock.js               # Mock data (temporary, before backend)
│
└── router/
    └── index.js              # Page routing config
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

