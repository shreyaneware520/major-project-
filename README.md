# AgriIntel Pro - Smart Farming Platform

Enterprise Yield Management Dashboard built with React and Vite.

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
package.json
vite.config.js
```

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Backend setup

The API is in [`backend/`](./backend) and uses PostgreSQL through Prisma.

```bash
cd backend
npm install
copy .env.example .env
# Update DATABASE_URL and JWT_SECRET in .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

The API runs at `http://localhost:4000`. The frontend uses that URL by default;
set `VITE_API_URL` when the API is hosted elsewhere. Signup accepts a zone
count and creates numbered zones in the same database transaction as the user.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run preview` — Preview production build
