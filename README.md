# Iqra Rattil LMS

Backend-driven Arabic LMS with React/Vite frontend, Express API, Prisma, PostgreSQL, in-app notifications, and real-time teacher-student chat.

[Read the portfolio case study](./CASE_STUDY.md)

## Frontend

```bash
npm install
cp .env.example .env
npm run dev
```

Default frontend URL: `http://localhost:5173`.

Frontend env:

- `VITE_API_URL`
- `VITE_SOCKET_URL` optional, defaults to the API host

## Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run admin:bootstrap
npm run restore:iqraa-content
npm run dev
```

Default API URL: `http://localhost:4000/api`.

## Deployment

- Frontend: Vercel.
- Backend: Render.
- Database: Neon PostgreSQL.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full Render/Vercel/Neon setup.

Deploy database changes with:

```bash
cd backend
npx prisma migrate deploy
npm run admin:bootstrap
npm run restore:iqraa-content
```

No demo users are required. The Iqraa books, educational levels, curriculum, academy settings, badges, and channel video titles are restored with `npm run restore:iqraa-content`; real uploaded book files/covers and YouTube links can then be added from the supervisor dashboard.

## Verification

```bash
npm run build
cd backend
npm run typecheck
npm run build
```

Optional UI smoke tests:

```bash
npm run test:e2e
```
