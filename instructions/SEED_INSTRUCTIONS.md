# 🌱 Database Seeding Instructions

## Quick Start

After setting up your database, run the seed script to populate it with sample data:

```bash
npm install
npm run db:seed
```

Or use Prisma's built-in seed command:

```bash
npx prisma db seed
```

## What Gets Created

The seed script creates:

### 📦 Products (18 items)
- **Toys** (3 items): Lego set, RC car, puzzle
- **Accessories** (3 items): Wallet, scarf, sunglasses
- **Cosmetics** (3 items): Face cream, lipstick set, perfume
- **Sweets** (3 items): Chocolate box, cookies, candies
- **Hygiene** (3 items): Bath set, shampoo, skincare kit
- **Other** (3 items): Candles, journal set

### 🎁 Pre-Made Boxes (5 boxes)

1. **Kids Fun Box** - $49.99
   - Lego set, chocolates, cookies
   
2. **Beauty & Wellness Box** - $79.99
   - Face cream, lipstick, perfume, bath set
   
3. **Sweet Treats Box** - $34.99
   - Multiple chocolate and candy items
   
4. **Luxury Gift Box** - $129.99
   - Premium accessories and luxury items
   
5. **Self-Care Box** - $64.99
   - Bath products, skincare, candles, chocolates

## Prerequisites

1. **Database must be set up**
   - PostgreSQL database created
   - `DATABASE_URL` in `.env` file
   - Schema pushed: `npm run db:push`

2. **Dependencies installed**
   - Run `npm install` to get `tsx` package

## Running the Seed

### First Time Setup

```bash
# 1. Install dependencies (includes tsx)
npm install

# 2. Set up database connection in .env
# DATABASE_URL="postgresql://..."

# 3. Push schema to database
npm run db:push

# 4. Run seed script
npm run db:seed
```

### Re-running the Seed

The seed script **clears existing data** before seeding. To keep existing data, comment out the cleanup section in `prisma/seed.ts`:

```typescript
// Comment out these lines if you want to keep existing data
// await prisma.orderItem.deleteMany()
// await prisma.preMadeBoxItem.deleteMany()
// ...
```

## Troubleshooting

### Error: "Cannot find module 'tsx'"
```bash
npm install
```

### Error: "Database connection failed"
- Check your `DATABASE_URL` in `.env`
- Ensure database is running
- Verify connection string format

### Error: "Table does not exist"
```bash
npm run db:push
```

### Error: "Foreign key constraint"
- Make sure you run `db:push` before seeding
- The seed script creates products first, then boxes

## Verifying the Seed

### Using Prisma Studio
```bash
npm run db:studio
```
Opens a visual database browser where you can see all seeded data.

### Using API
Visit these pages to see the data:
- `/products` - See all products
- `/premade-boxes` - See all pre-made boxes

## Customizing the Seed

Edit `prisma/seed.ts` to:
- Add more products
- Create custom boxes
- Adjust prices and descriptions
- Add more categories

## Notes

- Images use Unsplash placeholders - replace with real images later
- Prices are in AZN (Azerbaijani Manat)
- Stock levels are set to realistic numbers
- All products are marked as `isActive: true`

## Next Steps

After seeding:
1. ✅ Test product listing page
2. ✅ Test pre-made boxes page
3. ✅ Test adding items to cart
4. ✅ Implement order creation
5. ✅ Test checkout flow

