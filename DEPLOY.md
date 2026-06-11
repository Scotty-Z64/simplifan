# SimpliPlan Deployment Guide

## Architecture

| Layer | Service | URL |
|-------|---------|-----|
| Frontend | Vercel | https://simplifan.vercel.app |
| Backend API | Railway | https://simplifan-api.up.railway.app |
| Database | MySQL (Railway) | (internal) |

---

## Step 1: Deploy Backend to Railway

### 1.1 Push Code to GitHub

Make sure your project is in a GitHub repository:

```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/simplifan.git
git push -u origin main
```

### 1.2 Create Railway Project

1. Go to [railway.app](https://railway.app) and login with GitHub
2. Click **"New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select your `simplifan` repository
5. Railway will auto-detect the `railway.toml` and Dockerfile

### 1.3 Add Environment Variables

In Railway dashboard, go to your project → **Variables** tab, add:

| Variable | Value | Where to find |
|----------|-------|---------------|
| `DATABASE_URL` | `mysql://...` | Your MySQL connection string |
| `APP_ID` | `19eb4fa0...` | From `.env` file |
| `APP_SECRET` | `zGvIhsvu...` | From `.env` file |
| `VITE_APP_ID` | `19eb4fa0...` | From `.env` file |
| `VITE_KIMI_AUTH_URL` | `https://auth.kimi.com` | From `.env` file |
| `KIMI_AUTH_URL` | `https://auth.kimi.com` | From `.env` file |
| `KIMI_OPEN_URL` | `https://open.kimi.com` | From `.env` file |
| `OWNER_UNION_ID` | `d6d7h3nf...` | From `.env` file |

### 1.4 Deploy

Click **"Deploy"** in Railway. Wait for the build to complete.

### 1.5 Get Your Backend URL

After deployment, Railway will give you a URL like:
`https://simplifan-api.up.railway.app`

**Copy this URL** - you'll need it for the frontend.

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Connect Repository

1. Go to [vercel.com](https://vercel.com) and login with GitHub
2. Click **"Add New Project"**
3. Import your `simplifan` GitHub repository

### 2.2 Configure Build Settings

| Setting | Value |
|---------|-------|
| Framework Preset | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist/public` |

### 2.3 Add Environment Variables

In Vercel project settings → **Environment Variables**, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_API_URL` | `https://YOUR_RAILWAY_URL/api/trpc` | Production |

Replace `YOUR_RAILWAY_URL` with the actual URL from Step 1.5.

Example: `VITE_API_URL=https://simplifan-api.up.railway.app/api/trpc`

### 2.4 Deploy

Click **"Deploy"**. Vercel will build and deploy your frontend.

### 2.5 Custom Domain (Optional)

1. In Vercel project settings → **Domains**
2. Add your domain (e.g., `simplifan.co.za`)
3. Follow DNS instructions

---

## Step 3: Verify Everything Works

Open your Vercel URL and test:

1. **Home page loads** → ✅ Frontend working
2. **Browse vendors** → ✅ API connection working
3. **OTP Login** → `123456` → ✅ Backend + database working
4. **Send a message** → ✅ Real-time features working

---

## Troubleshooting

### CORS Errors
If you see CORS errors in browser console:
1. Check Railway has the correct `KIMI_AUTH_URL` and `KIMI_OPEN_URL`
2. Verify `VITE_API_URL` in Vercel points to the Railway URL

### Database Connection Fails
1. Check `DATABASE_URL` is correct in Railway
2. Ensure database allows connections from Railway's IP

### API Not Responding
1. Check Railway logs: Project → Deployments → Logs
2. Verify all environment variables are set

---

## Updating After Changes

Just push to GitHub - both Railway and Vercel auto-deploy:

```bash
git add .
git commit -m "Your changes"
git push
```

---

## Costs (Free Tier)

| Service | Free Allowance |
|---------|---------------|
| Vercel | Unlimited static sites |
| Railway | $5 credit/month (~500hrs) |
| Database | Included with Railway |
| **Total** | **$0/month** |

When you outgrow free tier:
- Railway: $5/mo for always-on + more resources
- Vercel: Free forever for static sites
