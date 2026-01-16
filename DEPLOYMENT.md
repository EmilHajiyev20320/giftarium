# 🚀 Deployment Guide for GiftBoxApp

This guide will walk you through deploying your Next.js application to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- [ ] Production database ready (PostgreSQL)
- [ ] Environment variables documented
- [ ] Domain name (optional, but recommended)
- [ ] Payment provider credentials (if using)

---

## 🗄️ Step 1: Set Up Production Database

### Option A: Neon (Recommended - Serverless PostgreSQL)

1. **Sign up at [neon.tech](https://neon.tech)**
2. **Create a new project**
3. **Copy the connection string** from the dashboard
4. **Note:** Neon provides a connection string that looks like:
   ```
   postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Option B: Supabase

1. **Sign up at [supabase.com](https://supabase.com)**
2. **Create a new project**
3. **Go to Settings → Database**
4. **Copy the connection string** (use the "Connection string" tab)
5. **Format:** `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### Option C: Railway

1. **Sign up at [railway.app](https://railway.app)**
2. **Create a new project**
3. **Add PostgreSQL service**
4. **Copy the connection string** from the service variables

### Option D: AWS RDS / DigitalOcean / Other

Use any PostgreSQL provider. Ensure:
- SSL/TLS is enabled
- Connection pooling is available (recommended)
- Backups are configured

---

## 🔧 Step 2: Run Database Migrations

After setting up your production database:

```bash
# Set your production DATABASE_URL temporarily
export DATABASE_URL="your-production-database-url"

# Generate Prisma Client
npm run db:generate

# Create and apply migrations
npx prisma migrate deploy

# OR if using db:push (for development/testing only)
npm run db:push
```

**Important:** Use `prisma migrate deploy` for production, not `db:push`.

---

## 🌐 Step 3: Deploy to Vercel (Recommended)

Vercel is the best platform for Next.js applications with zero-config deployment.

### 3.1: Prepare Your Repository

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### 3.2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** (use GitHub for easy integration)
3. **Click "Add New Project"**
4. **Import your Git repository**
5. **Configure the project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

### 3.3: Add Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# NextAuth
AUTH_SECRET=your-generated-secret-here
AUTH_URL=https://your-domain.vercel.app

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Environment
NODE_ENV=production
```

**Generate AUTH_SECRET:**
```bash
# On Windows PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# On Mac/Linux:
openssl rand -base64 32
```

### 3.4: Configure Build Settings

Vercel should auto-detect Next.js, but verify:

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 3.5: Deploy

1. **Click "Deploy"**
2. **Wait for build to complete** (usually 2-5 minutes)
3. **Your app will be live at:** `https://your-project.vercel.app`

### 3.6: Run Database Migrations on Vercel

After first deployment, you need to run migrations. You can:

**Option 1: Use Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migrations
vercel env pull .env.production
npx prisma migrate deploy
```

**Option 2: Add Build Script**
Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma migrate deploy && next build"
  }
}
```

**Option 3: Use Vercel's Build Command**
In Vercel dashboard → Settings → General:
- **Build Command:** `npx prisma migrate deploy && npm run build`

---

## 🔄 Step 4: Set Up Custom Domain (Optional)

1. **In Vercel dashboard → Settings → Domains**
2. **Add your domain** (e.g., `giftboxapp.com`)
3. **Follow DNS instructions:**
   - Add A record pointing to Vercel's IP
   - Or add CNAME record pointing to Vercel's domain
4. **Update AUTH_URL** in environment variables to your custom domain
5. **Redeploy** after DNS changes propagate

---

## 🔐 Step 5: Update Google OAuth (if using)

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select your project**
3. **Go to APIs & Services → Credentials**
4. **Edit your OAuth 2.0 Client**
5. **Add authorized redirect URIs:**
   - `https://your-domain.vercel.app/api/auth/callback/google`
   - `https://your-custom-domain.com/api/auth/callback/google` (if using custom domain)
6. **Update environment variables in Vercel**

---

## 🧪 Step 6: Test Production Deployment

1. **Visit your deployed URL**
2. **Test key features:**
   - [ ] User registration/login
   - [ ] Product browsing
   - [ ] Adding items to cart
   - [ ] Creating custom boxes
   - [ ] Checkout process
   - [ ] Order creation
   - [ ] Admin panel (if applicable)

---

## 🔍 Step 7: Monitor and Debug

### View Logs

**Vercel Dashboard:**
- Go to your project → **Deployments**
- Click on a deployment → **Functions** tab
- View server logs

**Vercel CLI:**
```bash
vercel logs
```

### Common Issues

**Database Connection Errors:**
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel's IPs
- Ensure SSL is enabled (`?sslmode=require`)

**Build Failures:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)

**Environment Variable Issues:**
- Double-check all variables are set
- Ensure no typos in variable names
- Redeploy after adding new variables

---

## 🚀 Alternative Deployment Options

### Option B: Railway

1. **Sign up at [railway.app](https://railway.app)**
2. **Create new project**
3. **Deploy from GitHub**
4. **Add PostgreSQL service**
5. **Set environment variables**
6. **Deploy!**

### Option C: Render

1. **Sign up at [render.com](https://render.com)**
2. **Create new Web Service**
3. **Connect GitHub repository**
4. **Configure:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. **Add PostgreSQL database**
6. **Set environment variables**
7. **Deploy!**

### Option D: Self-Hosted (VPS)

If deploying to your own server:

1. **Set up Node.js 18+ on your server**
2. **Clone repository**
3. **Install dependencies:** `npm install`
4. **Set environment variables**
5. **Run migrations:** `npx prisma migrate deploy`
6. **Build:** `npm run build`
7. **Start:** `npm start`
8. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "giftboxapp" -- start
   pm2 save
   pm2 startup
   ```

---

## 📝 Environment Variables Reference

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# NextAuth
AUTH_SECRET=your-32-character-secret
AUTH_URL=https://your-domain.com

# Environment
NODE_ENV=production
```

### Optional Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Payment Providers (when ready)
PAYRIFF_API_KEY=your-api-key
PAYRIFF_SECRET_KEY=your-secret-key
PORTMANAT_API_KEY=your-api-key
```

---

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to your main branch. For other branches:

1. **Push to a branch** (e.g., `develop`)
2. **Vercel creates a preview deployment**
3. **Test the preview**
4. **Merge to main** when ready
5. **Production automatically updates**

---

## 📊 Post-Deployment Checklist

- [ ] Database migrations applied successfully
- [ ] Environment variables set correctly
- [ ] Custom domain configured (if using)
- [ ] Google OAuth redirect URIs updated
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Application accessible via HTTPS
- [ ] All features tested in production
- [ ] Error monitoring set up (optional: Sentry, LogRocket)
- [ ] Analytics configured (optional: Google Analytics)

---

## 🆘 Troubleshooting

### Build Fails

**Error: Prisma Client not generated**
```bash
# Add to package.json scripts:
"postinstall": "prisma generate"
```

**Error: Database connection timeout**
- Check database allows external connections
- Verify firewall rules
- Ensure SSL is enabled in connection string

### Runtime Errors

**Error: AUTH_SECRET not found**
- Verify environment variable is set in Vercel
- Redeploy after adding variables

**Error: Database schema out of sync**
```bash
# Run migrations:
npx prisma migrate deploy
```

### Performance Issues

- Enable Vercel's Edge Network (automatic)
- Check database connection pooling
- Monitor API route performance in Vercel dashboard
- Consider adding Redis for caching (optional)

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [NextAuth Deployment](https://next-auth.js.org/deployment)

---

## 🎉 You're Live!

Your application should now be deployed and accessible. Share your URL and start accepting orders! 🎁

---

**Need Help?** Check the logs in your deployment platform's dashboard or review the error messages for specific guidance.
