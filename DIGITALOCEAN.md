# DigitalOcean Deployment

This setup runs the frontend, backend, PostgreSQL, and uploaded files on one
DigitalOcean Droplet with Docker Compose.

For a $5 budget, avoid DigitalOcean Managed Databases and App Platform persistent
file uploads. Use a small Droplet for testing, then upgrade when the site has
real users.

## 1. Create the Droplet

In DigitalOcean, create a Droplet from the Docker Marketplace image.

Recommended settings for the cheapest test deploy:

- Image: Docker on Ubuntu
- Plan: the smallest Basic/shared CPU plan available to you
- Region: the closest region to your users
- Backups: off if you must stay inside the $5 budget
- Authentication: SSH key if possible

After creation, copy the Droplet IP address.

## 2. SSH Into the Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

Add swap on very small Droplets so Docker builds have breathing room:

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
grep -q "/swapfile" /etc/fstab || echo "/swapfile none swap sw 0 0" >> /etc/fstab
```

Install Git if it is missing:

```bash
apt update
apt install -y git
```

## 3. Upload The Code

If your code is on GitHub:

```bash
git clone https://github.com/YOUR_USER/YOUR_REPO.git iqra-rattil
cd iqra-rattil
```

If it is not on GitHub yet, push it first or upload the project folder to the
Droplet with `scp`.

## 4. Configure Environment

```bash
cp .env.digitalocean.example .env
nano .env
```

Set these values:

```text
PUBLIC_ORIGIN=http://YOUR_DROPLET_IP
POSTGRES_PASSWORD=<strong database password>
JWT_SECRET=<at least 32 random characters>
ADMIN_BOOTSTRAP_EMAIL=<your admin email>
ADMIN_BOOTSTRAP_PASSWORD=<your admin password, 8+ chars>
ADMIN_BOOTSTRAP_NAME=<your admin display name>
```

Generate a good JWT secret with:

```bash
openssl rand -hex 32
```

## 5. Start The App

```bash
docker compose -f docker-compose.digitalocean.yml --env-file .env up -d --build
```

Check the API:

```bash
curl http://YOUR_DROPLET_IP/api/health
```

Open the app:

```text
http://YOUR_DROPLET_IP
```

## Useful Commands

View logs:

```bash
docker compose -f docker-compose.digitalocean.yml --env-file .env logs -f
```

Restart:

```bash
docker compose -f docker-compose.digitalocean.yml --env-file .env restart
```

Deploy updates:

```bash
git pull
docker compose -f docker-compose.digitalocean.yml --env-file .env up -d --build
```

Stop the app:

```bash
docker compose -f docker-compose.digitalocean.yml --env-file .env down
```

Warning: `down` keeps named volumes by default. Do not run `down -v` unless you
want to delete the database and uploaded files.

## Later: Domain And HTTPS

For real users, buy or connect a domain, point an `A` record to the Droplet IP,
then change `PUBLIC_ORIGIN` to your domain. After that, add HTTPS before sending
real logins or payments through the site.
