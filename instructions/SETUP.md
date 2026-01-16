# GiftBoxApp Setup Guide

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- Prisma & @prisma/client
- NextAuth v5
- Zustand
- Tailwind CSS
- Radix UI components
- And more...

### Step 2: Database Setup

1. **Create a PostgreSQL database**
   - Local: Install PostgreSQL and create a database
   - Cloud: Use Railway, Supabase, or Neon (recommended for production)

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/giftboxapp"
   ```

3. **Initialize database**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database (development)
   npm run db:push
   
   # OR create a migration (production)
   npm run db:migrate
   ```

### Step 3: Authentication Setup

1. **Generate AUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```
   Add to `.env`:
   ```env
   AUTH_SECRET="your-generated-secret-here"
   AUTH_URL="http://localhost:3000"
   ```

2. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Secret to `.env`:
     ```env
     GOOGLE_CLIENT_ID="your-client-id"
     GOOGLE_CLIENT_SECRET="your-client-secret"
     ```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📋 Environment Variables Checklist

Make sure your `.env` file has:

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `AUTH_SECRET` - NextAuth secret (32+ characters)
- [ ] `AUTH_URL` - Your app URL (http://localhost:3000 for dev)
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- [ ] `NODE_ENV` - Set to "development" or "production"

## 🗄️ Database Schema

The Prisma schema includes:

- **User** - User accounts and authentication
- **Product** - Individual products
- **PreMadeBox** - Curated gift boxes
- **PreMadeBoxItem** - Items in pre-made boxes
- **Order** - Customer orders (supports 3 types)
- **OrderItem** - Items in orders
- **Payment** - Payment records
- **Delivery** - Delivery information

## 🔧 Common Issues

### Prisma Client not generated
```bash
npm run db:generate
```

### Database connection errors
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running
- Verify database exists
- Check firewall/network settings

### NextAuth errors
- Verify `AUTH_SECRET` is set
- Check `AUTH_URL` matches your domain
- Ensure Google OAuth credentials are correct

### TypeScript errors
```bash
npm run db:generate
# Restart TypeScript server in your IDE
```

## 📦 Database Seeding (Optional)

Create a seed script to populate initial data:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Add seed data here
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Add to `package.json`:
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

## 🚢 Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database for Production

Recommended providers:
- **Neon**: Serverless PostgreSQL (free tier available)
- **Supabase**: PostgreSQL with additional features
- **Railway**: Simple PostgreSQL hosting

### Environment Variables for Production

Set these in your hosting platform:
- `DATABASE_URL` - Production database URL
- `AUTH_SECRET` - Production secret (different from dev)
- `AUTH_URL` - Your production domain
- `GOOGLE_CLIENT_ID` - Production OAuth credentials
- `GOOGLE_CLIENT_SECRET` - Production OAuth credentials
- `NODE_ENV` - Set to "production"

## 🧪 Testing the Setup

1. **Test database connection**
   ```bash
   npm run db:studio
   ```
   Opens Prisma Studio to view database

2. **Test authentication**
   - Visit `/register` - Create account
   - Visit `/login` - Sign in
   - Test Google OAuth

3. **Test pages**
   - Home page loads
   - Products page accessible
   - Can navigate between pages

## 📝 Next Steps

After setup is complete:

1. ✅ Database is connected
2. ✅ Authentication works
3. ✅ Pages are accessible
4. ⏭️ Implement order creation logic
5. ⏭️ Integrate payment providers
6. ⏭️ Add product images
7. ⏭️ Build admin dashboard

## 🆘 Need Help?

- Check [README.md](./README.md) for general info
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Review Next.js documentation
- Review Prisma documentation
- Review NextAuth documentation

