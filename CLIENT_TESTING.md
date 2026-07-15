# Client Testing From Your Device

You can run the app on your computer and give the client one temporary public
link. The link only works while your computer is on, connected to the internet,
and the dev servers are running.

## 1. Start The Database

If you use the local Docker PostgreSQL from this repo:

```bash
docker compose up postgres -d
```

## 2. Start The Backend

In a terminal:

```bash
cd backend
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev
npm run admin:bootstrap
npm run restore:iqraa-content
npm run dev
```

The backend should run on:

```text
http://localhost:4000
```

## 3. Start The Frontend In Tunnel Mode

In another terminal from the project root:

```bash
npm install
npm run dev:tunnel
```

The frontend should run on:

```text
http://localhost:5173
```

Tunnel mode makes the frontend call `/api`, `/uploads`, and `/socket.io` on the
same public URL. Vite then proxies those requests to the backend on your device.

## 4. Create A Public Link

Use one tunnel to expose the frontend port.

With Cloudflare Tunnel:

```bash
cloudflared tunnel --url http://localhost:5173
```

Give the generated `https://...trycloudflare.com` link to the client.

With ngrok:

```bash
ngrok http 5173
```

Give the generated `https://...ngrok-free.app` link to the client.

## Important Limits

- The link stops working when your laptop sleeps, disconnects, or the tunnel is
  closed.
- This is good for demos and testing, not production.
- Do not use real payment details or sensitive user data on a temporary local
  tunnel.
- Your upload speed affects how fast the app feels to the client.
