# Flextenure — Deployment Guide (GitHub Pages + Render)

## Overview
- **Frontend** → GitHub Pages (auto-deployed via GitHub Actions)
- **Backend**  → Render.com (triggered via GitHub Actions webhook)
- **Database** → MongoDB Atlas (free tier)

---

## Step 1: MongoDB Atlas

1. Sign up at https://www.mongodb.com/atlas (free)
2. Create a **free M0 cluster**
3. Go to **Database Access** → Add a new user (username + password)
4. Go to **Network Access** → Add IP `0.0.0.0/0`
5. Click **Connect → Drivers** and copy the URI:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/flextenure
   ```
   ← **This is your MONGO_URI — paste it in Render (Step 2)**

---

## Step 2: Deploy Backend on Render

1. Sign up at https://render.com (free)
2. New → **Web Service** → Connect your GitHub repo
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Under **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `MONGO_URI` | `mongodb+srv://...` ← paste your Atlas URI here |
   | `JWT_SECRET` | any long random string e.g. `mySuperSecret123!` |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_ORIGIN` | `https://Sadafrashid.github.io` |
   | `PORT` | `10000` |

5. Click **Deploy** — note your URL e.g. `https://flextenure-api.onrender.com`
6. Under **Settings** → find **Deploy Hook URL** → copy it

---

## Step 3: Add GitHub Secrets

In your repo → **Settings → Secrets and variables → Actions** → add:

| Secret Name | Value |
|-------------|-------|
| `RENDER_DEPLOY_HOOK_URL` | Deploy hook URL from Render |
| `REACT_APP_API_BASE_URL` | `https://flextenure-api.onrender.com` |

---

## Step 4: Enable GitHub Pages

1. Repo → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / root
4. Save

---

## Step 5: Push & Deploy

```bash
git add .
git commit -m "chore: add deployment config"
git push origin main
```

GitHub Actions will:
- Build the React app and publish it to GitHub Pages
- Trigger a new deploy on Render

Your app will be live at:
- **Frontend:** https://Sadafrashid.github.io/flextenure
- **Backend API:** https://flextenure-api.onrender.com

---

## Seed the Database (one-time)

After the backend is live, go to Render → your service → **Shell** tab:
```bash
node seed.js
```
