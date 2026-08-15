# 🚀 Render Deployment Guide for StudyForge AI

This directory and the root [`render.yaml`](../render.yaml) blueprint make **StudyForge AI** ready for instant deployment on [Render](https://render.com).

---

## Method 1: Automatic Deployment using Render Blueprint (Recommended)

1. Push your repository to **GitHub**.
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** $\rightarrow$ **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect [`render.yaml`](../render.yaml) and create two services:
   - **`studyforge-backend`** (Python Web Service)
   - **`studyforge-frontend`** (Static Site)
6. Enter required Environment Variables in Render Dashboard when prompted:
   - `MONGODB_URI`: Your Supabase PostgreSQL Connection String (`postgresql+asyncpg://...`)
   - `BREVO_API_KEY`: Your Brevo API Key
7. Click **Apply**. Render will build and deploy both services automatically!

---

## Method 2: Manual Deployment

### 1. Database (Supabase PostgreSQL)
Render does not host Supabase natively. Use a free **Supabase PostgreSQL** cluster:
1. Create a free cluster on [Supabase PostgreSQL](https://www.mongodb.com/cloud/atlas).
2. Get your connection URI string.

### 2. Backend Service (FastAPI)
1. In Render Dashboard, click **New +** $\rightarrow$ **Web Service**.
2. Connect your repository.
3. Configuration:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `MONGODB_URI` = `mongodb+srv://...`
   - `MONGODB_DATABASE` = `studyforge`
   - `JWT_ACCESS_SECRET` = `your-secure-random-key`
   - `JWT_REFRESH_SECRET` = `your-secure-random-key`
   - `BREVO_API_KEY` = `xkeysib-...`
   - `CORS_ORIGINS` = `*`

### 3. Frontend Service (React + Vite)
1. Click **New +** $\rightarrow$ **Static Site**.
2. Connect your repository.
3. Configuration:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Rewrite Rules:
   - **Source:** `/*`
   - **Destination:** `/index.html`
5. Add Environment Variables:
   - `VITE_API_BASE_URL` = `https://your-backend-service.onrender.com/api/v1`
