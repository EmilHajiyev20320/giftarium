# 🔧 Quick Database Setup Guide

## The Error You're Seeing

```
error: Environment variable not found: DATABASE_URL.
```

This means your `.env` file doesn't have a `DATABASE_URL` yet.

## Solution: Add DATABASE_URL to .env

You have 3 options:

### Option 1: Use Supabase (Free & Easy) ⭐ Recommended

1. **Go to https://supabase.com**
2. **Sign up** (free account)
3. **Create a new project**
4. **Wait for project to be ready** (takes ~2 minutes)
5. **Go to Settings → Database**
6. **Copy the connection string** (looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
7. **Add to your `.env` file**:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
   AUTH_SECRET="any-random-32-character-string-here"
   AUTH_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

### Option 2: Use Neon (Free & Easy)

1. **Go to https://neon.tech**
2. **Sign up** (free account)
3. **Create a new project**
4. **Copy the connection string** from the dashboard
5. **Add to your `.env` file**:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb"
   AUTH_SECRET="any-random-32-character-string-here"
   AUTH_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

### Option 3: Use Local PostgreSQL

If you have PostgreSQL installed locally:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/giftboxapp"
AUTH_SECRET="any-random-32-character-string-here"
AUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

## After Adding DATABASE_URL

1. **Push the schema to database**:
   ```bash
   npm run db:push
   ```

2. **Run the seed script**:
   ```bash
   npm run db:seed
   ```

## Quick Test (Temporary - Just to See It Work)

If you just want to test the seed script structure without a real database, you can use a dummy URL (but features won't work):

```env
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
```

**Note:** This won't actually work for real features, but it will let you see if the script runs.

## Your .env File Should Look Like:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
AUTH_SECRET="generate-a-random-32-character-string"
AUTH_URL="http://localhost:3000"

# Optional - Google OAuth (can skip for now)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Environment
NODE_ENV="development"
```

## Generate AUTH_SECRET

You can use any random string, or generate one:

**PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

Or just use: `"my-super-secret-key-for-development-only-32chars"`

## Next Steps

1. ✅ Add `DATABASE_URL` to `.env`
2. ✅ Add `AUTH_SECRET` to `.env`
3. ✅ Run `npm run db:push`
4. ✅ Run `npm run db:seed`
5. ✅ Check data with `npm run db:studio`

