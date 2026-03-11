# Addax Calendar Task Manager

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or remote)

### Install dependencies
```
npm install
```

### Development
Run both backend and frontend in development mode:
```
npm run dev
```
- Backend: http://localhost:4000
- Frontend: http://localhost:3000

### Build
```
npm run build
```

### Environment Variables
Copy `.env.example` to `.env` in `backend/` and set your MongoDB URI if needed.

---

## Project Structure
- `backend/` — Express.js API (TypeScript)
- `frontend/` — React app (TypeScript, Vite, Styled-Components, dnd-kit)
- `shared/` — Shared types/interfaces
