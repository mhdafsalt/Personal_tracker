# PK Workspace & Finance Manager

Personal Academic, Finance, Life Management, and Design Studio dashboard for **Muhammed Anas P K**.

Built with:
- **Frontend**: **Next.js 16** with **React 19** and pure **JSX** (`.jsx`), Tailwind CSS, Lucide Icons, and Motion.
- **Backend**: **Node.js** with **Express**, **Mongoose**, and **Google Gemini AI**.
- **Database**: **MongoDB** (MongoDB Atlas or Local MongoDB) with auto-sync and state persistence.
- **Cloud Hosting**: Ready for **Vercel** with zero-config serverless API routes.

---

## 📁 Project Architecture & Clean Folder Structure

```
Pk-Workspace-/
├── backend/                  # Dedicated Node.js Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js         # MongoDB connection manager & health status
│   │   ├── models/
│   │   │   └── Workspace.js  # Mongoose schema & collection model
│   │   ├── routes/
│   │   │   ├── gemini.js     # Google Gemini 3.8 Flash AI integration
│   │   │   └── workspace.js  # Sync & state load/save REST API
│   │   └── index.js          # Express app entrypoint (Node.js)
│   ├── .env                  # Local backend environment variables
│   ├── .env.example          # Sample environment variables
│   └── package.json          # Node.js backend package
│
├── frontend/                 # Next.js Full-Stack Application (JSX)
│   ├── app/
│   │   ├── api/              # Vercel Serverless Node.js Route Handlers
│   │   │   ├── gemini/chat/route.js
│   │   │   ├── health/route.js
│   │   │   ├── mongodb/status/route.js
│   │   │   └── workspace/route.js
│   │   ├── globals.css       # Tailwind CSS & theme definitions
│   │   ├── layout.jsx        # Root HTML layout with Google Fonts
│   │   └── page.jsx          # Home page entry
│   ├── lib/
│   │   ├── models/Workspace.js
│   │   └── mongodb.js        # Cached serverless Mongoose connection pool
│   ├── public/               # Static assets & illustrations
│   │   └── assets/
│   ├── src/
│   │   ├── components/       # Header, AlarmBanner, etc. (.jsx)
│   │   │   ├── modals/       # Profile, Database, Journal, Gemini AI (.jsx)
│   │   │   └── tabs/         # Dashboard, Study, Daily, Finance, Design (.jsx)
│   │   ├── context/          # WorkspaceContext state provider (.jsx)
│   │   ├── utils/            # PDF export & print helpers (.js)
│   │   └── App.jsx           # Main workspace orchestration (.jsx)
│   ├── .env.example
│   ├── .env.local            # Local Next.js environment configuration
│   ├── jsconfig.json         # JavaScript path aliasing (@/*)
│   ├── next.config.mjs       # Next.js configuration
│   ├── package.json
│   └── vercel.json
│
├── .env.example              # Consolidated environment configuration
├── .gitignore                # Git exclusions (node_modules, .next, etc.)
├── package.json              # Monorepo root scripts
├── vercel.json               # Root Vercel deployment configuration
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
From the repository root:
```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` to `backend/.env` and `frontend/.env.local`:
```bash
cp .env.example backend/.env
cp .env.example frontend/.env.local
```

Ensure your MongoDB Atlas URI is added:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/pk_workspace?retryWrites=true&w=majority
MONGODB_DB_NAME=pk_workspace
WORKSPACE_ID=muhammed_anas_default
GEMINI_API_KEY=your_optional_gemini_api_key
```

### 3. Run Development Servers
To run both backend and frontend concurrently:
```bash
npm run dev
```

Or run them individually:
- **Frontend only** (Next.js on port 3000):
  ```bash
  npm run dev:frontend
  ```
- **Backend only** (Node.js on port 4000):
  ```bash
  npm run dev:backend
  ```

Visit the app in your browser at:
- Frontend UI: `http://localhost:3000`
- Express Health Check: `http://localhost:4000/api/health`
- MongoDB Status: `http://localhost:4000/api/mongodb/status`

---

## 🌐 Deploying to Vercel (Step-by-Step)

The project includes built-in Next.js Route Handlers in `frontend/app/api/...` utilizing serverless connection caching with Mongoose. When deployed to Vercel, the entire frontend AND backend APIs run in a unified, scalable serverless setup.

### Option A: Deploy via GitHub (Recommended)
1. Push your repository to **GitHub**.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import your repository (`Pk-Workspace-`).
4. In **Project Settings**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Select `frontend` (or leave as root, as `vercel.json` is configured for both).
5. Add the following **Environment Variables** in Vercel:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://user:pass@cluster0.mongodb.net/pk_workspace?retryWrites=true&w=majority`)
   - `MONGODB_DB_NAME`: `pk_workspace`
   - `WORKSPACE_ID`: `muhammed_anas_default`
   - `GEMINI_API_KEY`: Your Gemini API key (optional, activates live AI features)
6. Click **Deploy**. Vercel will build and deploy your app in seconds!

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend folder
cd frontend
vercel

# Add environment variables
vercel env add MONGODB_URI
vercel env add MONGODB_DB_NAME
vercel env add GEMINI_API_KEY

# Deploy to production
vercel --prod
```

---

## 🗄️ MongoDB Atlas Setup Checklist

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. **Database Access**: Create a database user with username and password.
3. **Network Access**: Add IP `0.0.0.0/0` (Allow Access from Anywhere) so Vercel's serverless functions can connect.
4. Paste the connection string into `MONGODB_URI`.
5. The collection `workspaces` is initialized automatically on first sync.

---

## 🛡️ License
Private project for Muhammed Anas P K.
