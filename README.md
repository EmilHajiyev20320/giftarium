# GiftBoxApp

A full-stack e-commerce platform for creating and purchasing personalized gift boxes. Built with Next.js 15, TypeScript, Prisma, and PostgreSQL.

## 🎁 Features

- **Pre-Made Boxes**: Browse and purchase curated gift boxes
- **Custom Box Builder**: Select individual products to create your own gift box
- **Mystery Box**: Let us surprise you with a personalized gift box
- **User Authentication**: Email/password and Google OAuth
- **Order Management**: Track orders and view order history
- **Payment Integration**: Ready for Payriff and Portmanat integration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GiftBoxApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your:
   - Database connection string
   - NextAuth secret (generate with: `openssl rand -base64 32`)
   - Google OAuth credentials
   - Payment provider keys (when ready)

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database (for development)
   npm run db:push
   
   # Or create a migration (for production)
   npm run db:migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
GiftBoxApp/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (public_pages)/           # Public pages route group
│   │   ├── products/
│   │   ├── premade-boxes/
│   │   ├── custom-box/
│   │   ├── mystery-box/
│   │   └── checkout/
│   ├── (user)/                   # User-protected routes
│   │   └── orders/
│   ├── (dashboard_admin)/        # Admin dashboard (placeholder)
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── products/
│   │   ├── orders/
│   │   └── payments/
│   ├── layout.tsx
│   └── page.tsx
├── src/
│   ├── components/               # React components
│   │   ├── auth/
│   │   ├── checkout/
│   │   ├── custom-box/
│   │   ├── layout/
│   │   ├── mystery-box/
│   │   ├── orders/
│   │   ├── premade-boxes/
│   │   ├── products/
│   │   └── ui/
│   ├── lib/                      # Utility libraries
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── db.ts                # Prisma client
│   │   └── utils.ts             # Helper functions
│   ├── store/                    # Zustand stores
│   │   ├── cart-store.ts
│   │   └── custom-box-store.ts
│   └── types/                    # TypeScript types
├── prisma/
│   └── schema.prisma            # Database schema
└── public/                       # Static assets
```

## 🗄️ Database Schema

The application uses Prisma with PostgreSQL. Key entities:

- **User**: User accounts with authentication
- **Product**: Individual products for custom boxes
- **PreMadeBox**: Curated gift boxes
- **Order**: Orders supporting PREMADE, CUSTOM, and MYSTERY types
- **Payment**: Payment records with provider integration
- **Delivery**: Delivery information and tracking

## 🔐 Authentication

The app uses NextAuth v5 with:
- Email/password authentication
- Google OAuth
- JWT sessions

## 💳 Payment Integration

Payment integration is set up for:
- **Payriff**: Azerbaijan payment provider
- **Portmanat**: Alternative payment provider

API routes are ready at:
- `/api/payments/create-session` - Create payment session
- `/api/payments/webhook` - Handle payment webhooks

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes (dev)
- `npm run db:migrate` - Create migration (prod)
- `npm run db:studio` - Open Prisma Studio

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Database

Use one of these PostgreSQL providers:
- **Railway**: Easy setup, good for development
- **Supabase**: Free tier available
- **Neon**: Serverless PostgreSQL

## 📝 Next Steps

1. **Complete Order Creation**: Implement full order creation logic in `/api/orders`
2. **Payment Integration**: Integrate Payriff/Portmanat APIs
3. **Image Upload**: Set up image storage (Cloudinary, AWS S3, etc.)
4. **Admin Dashboard**: Build admin interface for managing products and orders
5. **Search Enhancement**: Integrate Meilisearch for advanced search
6. **Email Notifications**: Add order confirmation and tracking emails
7. **Corporate Orders**: Implement bulk/corporate order functionality

## 🎨 Styling

The project uses:
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons

## 📚 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth v5
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form + Zod

## 🤝 Contributing

This is a production-ready starter template. Follow these best practices:

1. Use TypeScript strictly
2. Follow Next.js App Router conventions
3. Keep components modular and reusable
4. Write clear commit messages
5. Test before deploying

## 📄 License

Private - All rights reserved

---

Built with ❤️ for personalized gifting experiences

