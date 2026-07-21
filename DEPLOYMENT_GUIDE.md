# Deployment to Vercel

## Option 1: Frontend Only (Fastest - 5 minutes)

This deploys just the Next.js frontend to Vercel. The backend and database run locally or on a separate platform.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nivaas-apartments.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Paste your GitHub repo URL
   - Click "Import"

3. **Configure Environment**
   - In Vercel project settings, go to "Environment Variables"
   - Add: `NEXT_PUBLIC_API_URL` = `http://localhost:3001` (for local dev) or your backend URL
   - Click "Save and Deploy"

4. **Deploy**
   - Vercel auto-deploys on git push
   - Your app is live at `https://nivaas-apartments.vercel.app`

---

## Option 2: Full Stack (Frontend + Backend)

### Backend Deployment Options:

#### A. Railway.app (Recommended - Free tier with PostgreSQL)
1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL plugin
4. Add Node.js service pointing to your repo
5. Set environment variables:
   - `DB_HOST` = railway postgres host
   - `DB_PORT` = 5432
   - `DB_NAME` = nivaas
   - `DB_USER` = postgres
   - `DB_PASSWORD` = generated
6. Run migration: `psql < schema.sql`
7. Get public URL for your API

#### B. Render.com
1. Go to https://render.com
2. Create new "Web Service"
3. Connect GitHub repo
4. Set build command: `cd api && npm install`
5. Set start command: `node api/server.js`
6. Add PostgreSQL database
7. Set environment variables pointing to the database
8. Deploy

#### C. AWS + RDS (Production Grade)
- Use AWS EC2 for the API server
- Use AWS RDS for PostgreSQL
- Use Route53 for custom domain

### Then Deploy Frontend to Vercel:
1. In Vercel Environment Variables, set:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.railway.app` (or render/aws)
2. Deploy

---

## Option 3: Docker + Render (Recommended for Demo)

This keeps the Docker setup but deploys to Render:

1. **Create a Dockerfile for the full stack:**
   ```dockerfile
   # See api/Dockerfile and root Dockerfile
   ```

2. **Push to GitHub with docker-compose.yml**

3. **Deploy API to Render:**
   - Go to https://render.com
   - Create "Web Service"
   - Connect your GitHub repo
   - Set build command: `cd api && npm install`
   - Set start command: `node server.js`
   - Add PostgreSQL database
   - Deploy
   - Get public URL: `https://nivaas-api.onrender.com`

4. **Deploy Frontend to Vercel:**
   - Go to https://vercel.com/new
   - Import GitHub repo
   - Set `NEXT_PUBLIC_API_URL=https://nivaas-api.onrender.com`
   - Deploy

---

## Current Setup Summary

- **Frontend (Next.js)**: Vercel ready ✓
- **API (Node.js)**: Needs external database (Railway, Render, AWS RDS)
- **Database (PostgreSQL)**: Must be external (can't run serverless)

---

## Quick Start for Demo

**Use Railway.app (easiest):**

1. Go to https://railway.app/new
2. Deploy from GitHub
3. Add PostgreSQL
4. Connect your repo and deploy

**Then Vercel:**

1. Go to https://vercel.com/new
2. Import GitHub repo
3. Set env var: `NEXT_PUBLIC_API_URL=https://your-railway-api.railway.app`
4. Deploy

**Total time: ~15 minutes**

---

## Secrets Management

For production, use Vercel Secrets:
```bash
vercel env add NEXT_PUBLIC_API_URL
vercel env add DATABASE_URL
```

Never commit `.env.local` or secrets to GitHub.

---

## Testing After Deployment

1. Visit `https://your-app.vercel.app`
2. Go to `/list-property` and submit a test
3. Go to `/admin` - should show stats from your live database
4. All data persists in Railway/Render database

---

## Rollback

On Vercel:
- Go to "Deployments" tab
- Click previous deployment
- Click "Promote to Production"

On Railway/Render:
- Redeploy previous version from Git history
