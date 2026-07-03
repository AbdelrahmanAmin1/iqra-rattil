# Deployment Guide

This project deploys as a static Vite frontend, an Express API, and a PostgreSQL database.

Recommended production stack:

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

## 1. Verify Locally

From the repository root:

```bash
npm run build
cd backend
npx prisma generate
npm run typecheck
npm run build
npm start
```

The backend should start with `node dist/src/server.js` and expose:

```text
http://localhost:4000/api/health
```

## 2. Create Neon PostgreSQL

Create a Neon project and copy the direct PostgreSQL connection string.

Use it as:

```text
DATABASE_URL=postgresql://...?...sslmode=require
```

Do not commit this value to the repository.

## 3. Deploy Backend on Render

Use the included `render.yaml` blueprint or configure the service manually:

- Root directory: `backend`
- Runtime: Node
- Build command: `npm ci && npx prisma generate && npm run build`
- Pre-deploy command: `npx prisma migrate deploy`
- Start command: `npm start`
- Health check path: `/api/health`

Set these environment variables in Render:

```text
DATABASE_URL=<Neon PostgreSQL connection string>
JWT_SECRET=<long random string, at least 32 chars>
JWT_EXPIRES_IN=7d
FRONTEND_URL=<Vercel production URL after frontend deploy>
UPLOAD_DIR=/var/data/iqra-uploads
MAX_UPLOAD_SIZE_MB=50
ADMIN_BOOTSTRAP_EMAIL=<admin email>
ADMIN_BOOTSTRAP_PASSWORD=<admin password>
ADMIN_BOOTSTRAP_NAME=<admin display name>
```

Attach a Render persistent disk:

- Name: `iqra-uploads`
- Mount path: `/var/data`
- App upload directory: `/var/data/iqra-uploads`

After Render deploys, verify:

```text
https://<render-backend>.onrender.com/api/health
```

Then run the one-time production setup from the Render Shell:

```bash
node dist/prisma/admin-bootstrap.js
node dist/prisma/restore-iqraa-content.js
```

## 4. Deploy Frontend on Vercel

Use the included `vercel.json` or configure manually:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

Set these Vercel environment variables:

```text
VITE_API_URL=https://<render-backend>.onrender.com/api
VITE_SOCKET_URL=https://<render-backend>.onrender.com
```

After Vercel deploys, copy the production frontend URL into Render as `FRONTEND_URL`, then redeploy the backend so CORS accepts the live frontend.

## 5. Production Smoke Test

Test the live Vercel URL:

- Public homepage loads real backend content.
- Admin login works with the bootstrapped supervisor.
- Teacher registration creates a pending teacher.
- Admin approves the teacher.
- Student registration works.
- Teacher can assign an unassigned student.
- Teacher/student chat connects.
- Uploaded files remain available after a backend redeploy because they are stored on the Render disk.
