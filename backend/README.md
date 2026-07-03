# Iqra Rattil Backend

Express + TypeScript API for the Arabic LMS frontend. Data is stored in PostgreSQL through Prisma.

## Local Setup

```bash
cp .env.example .env
docker compose up postgres -d
npm install
npx prisma generate
npx prisma migrate dev
npm run admin:bootstrap
npm run restore:iqraa-content
npm run dev
```

The API runs on `http://localhost:4000`.

## Bootstrap Admin

There are no demo users required. The first supervisor account is created from env values:

- `ADMIN_BOOTSTRAP_EMAIL`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `ADMIN_BOOTSTRAP_NAME`

Run:

```bash
npm run admin:bootstrap
```

If you previously used the old demo seed workflow, remove known seed records with:

```bash
npm run clear-demo-data
```

This preserves the real Iqraa project content.

## Iqraa Project Content

Books, educational levels, curriculum chapters, starter lessons, quizzes, badges, channel video titles, and academy settings are restored with:

```bash
npm run restore:iqraa-content
```

The restore is backend-driven and idempotent. It does not create demo accounts, fake Zoom sessions, or fake YouTube links. Existing uploaded book files/covers and existing YouTube IDs are preserved.

Students register as active immediately. Teachers register as pending and require supervisor approval.

## Environment

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- `PORT`
- `UPLOAD_DIR`
- `MAX_UPLOAD_SIZE_MB`
- `ADMIN_BOOTSTRAP_EMAIL`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `ADMIN_BOOTSTRAP_NAME`

## Verification

```bash
npm run typecheck
npm run build
npm start
```

Use Prisma migrations for deployments. The root [DEPLOYMENT.md](../DEPLOYMENT.md) file contains the full Render/Vercel/Neon setup:

```bash
npx prisma migrate deploy
npm run admin:bootstrap
npm run restore:iqraa-content
```
