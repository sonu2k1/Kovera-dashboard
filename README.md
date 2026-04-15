# Kovera Admin Dashboard

A complete admin dashboard frontend for the **Kovera** real estate platform — built with React, Vite, and Tailwind CSS.

## 🚀 Live Preview

<p align="center">
  <a href="https://kovera-dashboard.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/▶%20Live%20Preview-Visit%20Demo-22c55e?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Preview" />
  </a>
</p>

🔗 **https://kovera-dashboard.vercel.app/**

> **Login:** `admin@kovera.io` / `admin123`

## ✨ Features

- 🔐 Admin login with JWT authentication
- 📊 Dashboard with KPI cards, Recharts visualizations & auto-refresh
- 🔍 Global search with filters, debounce & keyword highlight
- 👥 Users module — table, detail modal, status toggle
- 🏢 Agents module — ratings, verification, grid/table view
- 🏠 Properties module — type/location/price filters, grid & table toggle
- 💼 Trades module — timeline view, status tracking, clickable parties
- ⚙️ Settings — profile, notifications, security, dark/light theme
- 🌙 Dark / ☀️ Light mode toggle (persisted)
- 📱 Fully responsive (desktop-first, mobile overlay sidebar)

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| Data Fetching | TanStack React Query |
| HTTP Client | Axios |
| Charts | Recharts |
| Icons | Lucide React |

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/          # Button, Badge, Card, Select, Modal, Skeleton...
│   ├── common/      # StatCard, DataTable, ProtectedRoute, KoveraLogo
│   └── layout/      # DashboardLayout, Sidebar, Header
├── context/         # AuthContext, SidebarContext, ThemeContext
├── pages/           # Dashboard, Search, Users, Agents, Properties, Trades, Settings
├── routes/          # Centralized route config with lazy loading
├── services/
│   ├── api/         # Axios instance
│   └── hooks/       # React Query hooks (useUsers, useAgents, etc.)
└── lib/             # Utility functions (cn)
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

## 📄 License

MIT
