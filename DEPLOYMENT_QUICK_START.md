# ⚡ Quick Deployment Guide

## 🚀 Fastest Way to Deploy (5 Minutes)

### 1. Set Up Database (2 minutes)

**Option A: Neon (Easiest)**
1. Go to [neon.tech](https://neon.tech) → Sign up
2. Create project → Copy connection string
3. Done! ✅

**Option B: Supabase**
1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create project → Settings → Database → Copy connection string
3. Done! ✅

### 2. Deploy to Vercel (3 minutes)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Environment Variables** (in Vercel dashboard):
   ```env
   DATABASE_URL=your-database-connection-string
   AUTH_SECRET=generate-random-32-chars
   AUTH_URL=https://your-project.vercel.app
   NODE_ENV=production
   ```

4. **Run Migrations:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and link
   vercel login
   vercel link
   
   # Pull env and run migrations
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

5. **Redeploy** in Vercel dashboard

### 3. Generate AUTH_SECRET

**Windows PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

---

## ✅ That's It!

Your app is now live at: `https://your-project.vercel.app`

---

## 📋 Full Guide

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🔧 Common Commands

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations (production)
npm run db:migrate:deploy

# Build locally
npm run build

# Start production server locally
npm start
```
