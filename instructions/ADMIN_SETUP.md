# Admin Panel Setup Guide

## Creating an Admin User

The seed script automatically creates an admin user. You have three options:

### Option 1: Use Seed Script (Recommended)

The seed script now automatically creates an admin user. Simply run:

```bash
npm run db:seed
```

**Default Admin Credentials:**
- Email: `admin@giftarium.com`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the password after first login!

**Custom Admin Credentials:**

You can set custom admin credentials using environment variables:

```bash
ADMIN_EMAIL=your-email@example.com ADMIN_PASSWORD=your-secure-password npm run db:seed
```

Or add them to your `.env` file:
```
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
```

### Option 2: Update Existing User via Database

1. Register a regular user account through the website
2. Connect to your PostgreSQL database
3. Run this SQL query:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-admin-email@example.com';
```

### Option 3: Manual Creation via Prisma Studio

1. Run `npm run db:studio`
2. Navigate to the User table
3. Create a new user or update an existing one
4. Set `role` to `ADMIN`
5. Make sure to hash the password using bcrypt

## Accessing the Admin Panel

1. Navigate to `/login` (the regular login page)
2. Sign in with your admin credentials
3. You'll be automatically redirected to the admin dashboard at `/admin`

**Or** if you're already signed in as an admin:
- Click the "Admin Panel" button in the navbar (visible only to admins)
- Or navigate directly to `/admin`

**Note:** There is no separate admin login page. Admins use the same login page as regular users, and the system automatically detects admin users and redirects them to the admin panel.

## Troubleshooting

### If you can't see admin privileges after signing in:

1. **Check if your user has ADMIN role:**
   ```bash
   npx tsx scripts/check-admin.ts your-email@example.com
   ```

2. **If the user is not an admin, make them one:**
   ```bash
   npx tsx scripts/make-admin.ts your-email@example.com
   ```

3. **Sign out and sign back in** for the changes to take effect

4. **Clear your browser cookies** if the issue persists

## Admin Features

- **Dashboard**: Overview of products, boxes, users, and orders
- **Products Management**: Add, edit, delete products with image upload
- **Pre-Made Boxes**: View and manage pre-made gift boxes
- **Box Types**: Configure box sizes and capacities
- **Users Management**: View all users, sort by registration date or order count
- **Orders Management**: View and monitor all orders

## Security Notes

- Admin routes are protected by middleware
- Only users with `role = 'ADMIN'` can access admin pages
- Regular users cannot access admin login or admin routes
- All admin API routes require admin authentication

