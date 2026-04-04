# 🚀 CareDose AI - Vercel Deployment Guide

Follow these steps to deploy only the website from your repository to Vercel for free.

## Prerequisites
- A **GitHub** account with your code pushed to a repository.
- A **Vercel** account (connected to your GitHub).

---

## 🛠️ Deployment Steps

### 1. Import Project
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Select your `tic-codeflux` repository.

### 2. Configure Settings (CRITICAL)
In the **Configure Project** screen, don't just click deploy! You must set these specific fields:

- **Project Name:** `caredose-ai-web` (or any name you like)
- **Framework Preset:** `Vite` (should be auto-detected)
- **Root Directory:** Click "Edit" and select the **`web`** folder.
- **Build & Output Settings:**
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
  - **Install Command:** `npm install`

### 3. Environment Variables (IMPORTANT)
If you have a deployed backend (e.g. on Render or Railway), add this variable to the **Environment Variables** section:
- **Key:** `VITE_API_URL`
- **Value:** `https://your-backend-url.com/api`

> [!NOTE]
> If you don't add this, the app will try to connect to `localhost:3001` and won't work for public users.

### 4. Deploy
Click **Deploy**. Wait 1-2 minutes for the build to complete.

---

## ✅ Post-Deployment Check
- Visit your new `.vercel.app` URL.
- Try navigating to `/dashboard` or `/how-it-works`.
- **Refresh the page** while on a subpage — if it loads without a 404, the `vercel.json` I created is working correctly!

## 🛠️ Troubleshooting
If the build fails:
1. Ensure you selected the **`web`** directory as the Root Directory.
2. Check that the `package.json` in the `web` folder has the `build` script.
