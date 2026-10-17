# 🚀 GoPratle — Production Deployment Guide

This guide provides a step-by-step walkthrough to deploy **GoPratle** to production using:
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Free M0 Cluster)
- **Backend API**: [Render](https://render.com) (Free Web Service)
- **Frontend App**: [Vercel](https://vercel.com) (Free Hobby Tier)

---

## 📋 Pre-Deployment Verification (Status: ✅ All Passing)

| Component | Target Platform | Test / Build Command | Verification Status |
| :--- | :--- | :--- | :--- |
| **Backend API** | Render | `npm test --prefix backend` | ✅ 18/18 Unit Tests Passing |
| **Frontend App** | Vercel | `npm run build --prefix frontend` | ✅ Zero TypeScript/Lint Errors (Next.js 16) |
| **Frontend Tests**| Vercel | `npm test --prefix frontend` | ✅ 9/9 Vitest Component Tests Passing |
| **Full Suite** | CI / Monorepo | `npm test` | ✅ 27/27 Tests Passing |

---

## 🛠️ Step 0: Push Code to GitHub

GoPratle is organized as a clean monorepo with `frontend/` and `backend/`. Both platforms deploy straight from your GitHub repository.

1. In your project root (`GoPartle/`), initialize Git and push:
```bash
git init
git add .
git commit -m "feat: GoPratle full-stack platform ready for deployment"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

> **Note:** Sensitive files (`.env`, `.env.local`, `node_modules/`, `.next/`) are already safeguarded in `.gitignore`.

---

## 🍃 Step 1: Set Up MongoDB Atlas (Database)

1. Log in to [MongoDB Atlas](https://account.mongodb.com/).
2. Create a **Shared M0 Cluster** (Free tier, choose AWS and a region closest to you, e.g., Mumbai `ap-south-1` or Singapore `ap-southeast-1`).
3. Under **Security → Database Access**:
   - Click **Add New Database User**.
   - Choose **Password** authentication.
   - Enter a username (e.g., `gopratle_admin`) and a strong password (save these!).
   - Assign user privileges: **Read and write to any database**.
4. Under **Security → Network Access**:
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`).
   - *Why?* Cloud providers like Render assign dynamic egress IP addresses to web services.
5. Under **Deployment → Database → Connect**:
   - Choose **Drivers** (Node.js).
   - Copy your connection string. It will look like:
     ```text
     mongodb+srv://gopratle_admin:<password>@cluster0.abcde.mongodb.net/gopratle?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your database user password, and make sure `/gopratle` is the database name before `?retryWrites`.

---

## ⚡ Step 2: Seed MongoDB Atlas with Demo Data

You can seed your live MongoDB Atlas database directly from your local machine before the backend goes live:

```bash
# Option A: Pass Atlas URI directly as an argument
node backend/src/scripts/seed.js "mongodb+srv://gopratle_admin:<password>@cluster0.abcde.mongodb.net/gopratle?retryWrites=true&w=majority"

# Option B: Run via npm script from root
npm run seed -- "mongodb+srv://gopratle_admin:<password>@cluster0.abcde.mongodb.net/gopratle?retryWrites=true&w=majority"
```

The script will idempotently insert the 15 synthetic Indian event requirements (planners, performers, crew) and verify database connectivity.

---

## 🖥️ Step 3: Deploy Backend to Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Name**: `gopratle-api`
   - **Region**: Choose closest to your DB (e.g., Singapore or Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend`  *(⚠️ Important: do not leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: `Free`
5. Expand **Advanced Settings**:
   - **Health Check Path**: `/api/health`
6. Add the following **Environment Variables**:

| Variable Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations |
| `PORT` | `10000` | Render standard port |
| `MONGODB_URI` | `mongodb+srv://gopratle_admin:<password>@cluster0.abcde.mongodb.net/gopratle?retryWrites=true&w=majority` | Your Atlas connection string |
| `FRONTEND_URL` | `*` *(or your Vercel URL once generated)* | Allowed origin for CORS |

7. Click **Create Web Service**.
8. Once deployment finishes, Render gives you a public URL (e.g. `https://gopratle-api.onrender.com`).
9. **Test it in your browser:**
   - Visit `https://gopratle-api.onrender.com/api/health`
   - Expected JSON response:
     ```json
     {
       "status": "healthy",
       "timestamp": "2026-...",
       "uptime": 12.34,
       "database": "connected"
     }
     ```

---

## ▲ Step 4: Deploy Frontend to Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New…** → **Project**.
3. Import your GoPratle GitHub repository.
4. In the **Configure Project** screen:
   - **Project Name**: `gopratle` (or custom name)
   - **Framework Preset**: `Next.js` (automatically detected)
   - **Root Directory**: Click **Edit** and select `frontend` *(⚠️ Important!)*
5. Expand the **Environment Variables** section:

| Variable Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://gopratle-api.onrender.com/api` |

> **Pro-Tip:** Even if you accidentally omit `/api` or add a trailing slash, GoPratle's frontend API client automatically normalizes the URL.

6. Click **Deploy**.
7. Vercel will build the Next.js App Router application and provide your production link:
   - `https://gopratle.vercel.app`

---

## 🔒 Step 5: Final CORS Polish (Optional)

Now that you have your exact Vercel URL:
1. Go back to **Render** → `gopratle-api` → **Environment**.
2. Change `FRONTEND_URL` from `*` to your production Vercel URL (e.g., `https://gopratle.vercel.app`).
3. Click **Save Changes** (Render will redeploy with the strict origin whitelist).
   *(Note: The backend's CORS matcher also automatically supports preview deployments matching `*.vercel.app`).*

---

## 🧪 Post-Deployment Smoke Test Checklist

Once both services are live, verify the core user journeys:

1. **Visit Home Page** (`https://<your-app>.vercel.app`):
   - Hero section loads with dark theme styling.
   - Live metrics counters reflect database records.
2. **Explore Directory** (`/events`):
   - Filter tabs (All, Planners, Performers, Crew) filter records smoothly.
   - Search bar searches across titles, descriptions, and locations.
   - Clicking any event card opens the full dynamic detail page (`/events/:id`).
3. **Submit a New Requirement** (`/requirements/new`):
   - Complete Step 1 (Event Category & Basic Details).
   - Complete Step 2 (Event Type & Role-Specific Requirements).
   - Complete Step 3 (Date, Location & Budget).
   - Complete Step 4 (Client Contact Info).
   - Review and click **Submit Event Requirement**.
   - Confetti celebration appears with a real MongoDB ID!
4. **Session Tracker** (`/my-requirements`):
   - Your newly created event requirement appears in your local session requirements list with direct links and action buttons.

---

## 💡 Troubleshooting & FAQs

### Q1: The backend is taking 30–50 seconds on first request?
- **Cause**: Render's Free tier puts inactive instances to sleep after 15 minutes of inactivity.
- **Solution**: The first request spins up the server. Subsequent requests respond instantly in <100ms.

### Q2: CORS error in browser console?
- **Cause**: Mismatched `FRONTEND_URL` in Render.
- **Solution**: GoPratle's backend CORS matcher includes built-in wildcard support for `*.vercel.app` domains. If testing custom domains, ensure `FRONTEND_URL` matches your exact scheme and domain (e.g. `https://mycustomdomain.com`).

### Q3: MongoDB connection timeout on Render?
- **Cause**: MongoDB Atlas IP Access List does not allow `0.0.0.0/0`.
- **Solution**: In Atlas, navigate to **Network Access** and verify that `0.0.0.0/0` (Allow Access from Anywhere) is active.

### Q4: Seed script failed with authentication error?
- **Cause**: Special characters in MongoDB password not URL-encoded.
- **Solution**: If your password contains `@`, `:`, `/`, or `%`, URL-encode them (e.g., `@` becomes `%40`) or create a user with an alphanumeric password.
