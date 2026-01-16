# 🔧 Database Connection Troubleshooting

## Error: "Can't reach database server"

This usually means one of these issues:

### 1. Database is Paused (Most Common) ⭐

**Supabase free tier pauses databases after inactivity.**

**Solution:**
1. Go to https://supabase.com/dashboard
2. Find your project
3. If you see "Paused" or "Resume" button, click it
4. Wait 1-2 minutes for database to resume
5. Try `npm run db:push` again

### 2. Check Connection String Format

Your connection string should look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**Common issues:**
- Missing password in URL
- Wrong format
- Password has special characters (need to URL encode)

**Fix:**
- Go to Supabase Dashboard → Settings → Database
- Click "Connection string" → Select "URI"
- Copy the exact string (it includes the password)

### 3. Network/Firewall Issues

**If you're behind a firewall or VPN:**
- Try disabling VPN temporarily
- Check if your network blocks PostgreSQL connections
- Try from a different network

### 4. Verify Database is Running

1. Go to Supabase Dashboard
2. Check project status
3. Look for any error messages
4. Check if project is still active

### 5. Test Connection String

You can test the connection string format:

**PowerShell:**
```powershell
# Test if the host is reachable (won't test auth, just connectivity)
Test-NetConnection db.bwpcdsyxiojpilrcitto.supabase.co -Port 5432
```

## Quick Fix Steps

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard

2. **Check Project Status**
   - Is it paused? → Click "Resume"
   - Is it active? → Check connection string

3. **Get Fresh Connection String**
   - Settings → Database
   - Connection string → URI
   - Copy and update `.env`

4. **Wait 1-2 minutes** after resuming

5. **Try again:**
   ```bash
   npm run db:push
   ```

## Alternative: Use Connection Pooling

If direct connection doesn't work, try the connection pooler:

1. Go to Supabase Dashboard → Settings → Database
2. Find "Connection Pooling"
3. Use the "Transaction" or "Session" mode connection string
4. It will have a different port (usually 6543 or 5432)

Format:
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true
```

## Still Not Working?

1. **Check Supabase Status**: https://status.supabase.com
2. **Verify Project**: Make sure project wasn't deleted
3. **Create New Project**: If all else fails, create a fresh Supabase project
4. **Try Neon Instead**: https://neon.tech (alternative free PostgreSQL)

## Test Connection

After fixing, test with:
```bash
npm run db:push
```

If successful, you'll see:
```
✔ Generated Prisma Client
✔ Pushed database schema
```

Then run seed:
```bash
npm run db:seed
```

