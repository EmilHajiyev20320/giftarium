# 🗄️ Local PostgreSQL Setup Guide

## Step 1: Install PostgreSQL

### Windows Installation

1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Or use the installer: https://www.postgresql.org/download/
   - Download the latest version (15 or 16 recommended)

2. **Run the Installer:**
   - Run the downloaded `.exe` file
   - Follow the installation wizard
   - **Important:** Remember the password you set for the `postgres` user
   - Default port is `5432` (keep this)
   - Default installation location is usually fine

3. **Verify Installation:**
   - Open Command Prompt or PowerShell
   - Run: `psql --version`
   - Should show PostgreSQL version

## Step 2: Create Database

### Option A: Using pgAdmin (GUI - Easier)

1. **Open pgAdmin** (installed with PostgreSQL)
2. **Connect to server:**
   - Right-click "Servers" → "Create" → "Server"
   - Name: `localhost` or `PostgreSQL`
   - Connection tab:
     - Host: `localhost`
     - Port: `5432`
     - Username: `postgres`
     - Password: (the one you set during installation)
3. **Create database:**
   - Right-click "Databases" → "Create" → "Database"
   - Name: `giftboxapp`
   - Click "Save"

### Option B: Using Command Line (Faster)

1. **Open Command Prompt or PowerShell**

2. **Connect to PostgreSQL:**
   ```bash
   psql -U postgres
   ```
   Enter your password when prompted

3. **Create database:**
   ```sql
   CREATE DATABASE giftboxapp;
   ```

4. **Exit psql:**
   ```sql
   \q
   ```

## Step 3: Update .env File

Update your `.env` file with the local connection string:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/giftboxapp"
AUTH_SECRET="any-random-32-character-string"
AUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

**Replace:**
- `YOUR_PASSWORD` with the password you set for the `postgres` user
- Make sure database name is `giftboxapp` (or whatever you named it)

### Example:
If your password is `mypassword123`:
```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/giftboxapp"
```

## Step 4: Test Connection

1. **Push schema to database:**
   ```bash
   npm run db:push
   ```

2. **If successful, you'll see:**
   ```
   ✔ Generated Prisma Client
   ✔ Pushed database schema
   ```

3. **Seed the database:**
   ```bash
   npm run db:seed
   ```

## Step 5: Verify Data

Open Prisma Studio to see your data:
```bash
npm run db:studio
```

This opens a browser at `http://localhost:5555` where you can view all tables and data.

## Troubleshooting

### Error: "psql: command not found"
- PostgreSQL might not be in PATH
- Try using full path: `C:\Program Files\PostgreSQL\15\bin\psql.exe -U postgres`
- Or add PostgreSQL bin folder to system PATH

### Error: "password authentication failed"
- Check your password
- Try resetting PostgreSQL password
- Or create a new user

### Error: "database does not exist"
- Make sure you created the database named `giftboxapp`
- Check the database name in your `.env` file matches

### Error: "connection refused"
- Make sure PostgreSQL service is running
- Check Windows Services: `services.msc`
- Look for "postgresql-x64-15" (or your version)
- Start the service if it's stopped

### Can't remember PostgreSQL password
1. Open `pgAdmin`
2. Right-click server → Properties
3. Or reset via Windows Services

## Quick Commands Reference

```bash
# Connect to PostgreSQL
psql -U postgres

# List all databases
psql -U postgres -l

# Create database (in psql)
CREATE DATABASE giftboxapp;

# Drop database (if needed)
DROP DATABASE giftboxapp;

# Exit psql
\q
```

## Advantages of Local PostgreSQL

✅ No internet required  
✅ Faster (no network latency)  
✅ Free (no cloud costs)  
✅ Full control  
✅ Good for development  

## Next Steps

After setup:
1. ✅ Database created
2. ✅ Schema pushed
3. ✅ Data seeded
4. ✅ Ready to develop!

