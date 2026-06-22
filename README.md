# StockFlow — Inventory Management

A React codebase converted from the single-file HTML MVP.

## Project Structure

```
stockflow/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # Entry point
    ├── App.jsx               # Root component + routing
    ├── App.css               # App shell layout
    ├── data/
    │   └── seed.js           # Seed data (products, categories, suppliers, activity)
    ├── styles/
    │   └── global.css        # CSS variables, buttons, badges, forms, table, modal
    ├── components/
    │   ├── StatusBadge.jsx   # In Stock / Low Stock / Out of Stock badge
    │   ├── Sidebar.jsx       # Left navigation
    │   ├── Sidebar.css
    │   ├── Topbar.jsx        # Top bar with search and avatar
    │   └── Topbar.css
    └── pages/
        ├── LoginPage.jsx     # Login screen
        ├── LoginPage.css
        ├── Dashboard.jsx     # Stat cards + recent activity table
        ├── Dashboard.css
        ├── Products.jsx      # Product table with add/delete + modal
        ├── Categories.jsx    # Category grid with add modal
        ├── Categories.css
        ├── Suppliers.jsx     # Supplier table with add/delete modal
        ├── Inventory.jsx     # Inventory table with stock in/out actions
        ├── Reports.jsx       # Bar charts + inventory summary
        ├── Reports.css
        ├── Settings.jsx      # Account form + notification toggles
        └── Settings.css
```

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

**Default credentials** (no real auth — any input works):
- Email: `admin@stockflow.ng`
- Password: `password`

## What changed from the HTML MVP

- All JSX extracted from the `<script type="text/babel">` block into proper `.jsx` files
- CSS extracted from `<style>` into scoped `.css` files co-located with their components
- Seed data moved to `src/data/seed.js` — import wherever needed
- Shared primitives (`StatusBadge`, `Sidebar`, `Topbar`) live in `src/components/`
- Pages live in `src/pages/`, each owning their own styles
- Vite replaces the CDN Babel + React UMD approach for a real build pipeline
- `React.StrictMode` enabled in `main.jsx`
