# GiftBoxApp Architecture Documentation

## 🏗️ System Architecture

### Overview
GiftBoxApp is built as a modern full-stack Next.js application using the App Router pattern. The architecture follows a modular, scalable approach with clear separation of concerns.

## 📂 Folder Structure

```
GiftBoxApp/
├── app/                          # Next.js App Router (Server Components by default)
│   ├── (auth)/                   # Route group for authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (public_pages)/           # Route group for public pages
│   │   ├── products/             # Product catalog
│   │   ├── premade-boxes/        # Pre-made box listings
│   │   ├── custom-box/           # Custom box builder
│   │   ├── mystery-box/          # Mystery box form
│   │   └── checkout/             # Checkout process
│   ├── (user)/                   # Route group for authenticated user pages
│   │   └── orders/               # Order history and tracking
│   ├── (dashboard_admin)/        # Route group for admin (future)
│   ├── api/                      # API Routes (Server Actions)
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── products/             # Product CRUD
│   │   ├── orders/               # Order management
│   │   └── payments/             # Payment processing
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── src/
│   ├── components/               # React Components
│   │   ├── auth/                 # Authentication components
│   │   ├── checkout/             # Checkout components
│   │   ├── custom-box/           # Custom box builder components
│   │   ├── layout/               # Layout components (Navbar, Footer)
│   │   ├── mystery-box/          # Mystery box components
│   │   ├── orders/               # Order components
│   │   ├── premade-boxes/        # Pre-made box components
│   │   ├── products/             # Product components
│   │   └── ui/                   # Reusable UI components
│   ├── lib/                      # Core Libraries
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── db.ts                 # Prisma client singleton
│   │   └── utils.ts              # Utility functions
│   ├── store/                    # Zustand State Management
│   │   ├── cart-store.ts         # Shopping cart state
│   │   └── custom-box-store.ts   # Custom box builder state
│   └── types/                    # TypeScript Type Definitions
│       ├── index.ts              # Shared types
│       └── next-auth.d.ts        # NextAuth type extensions
├── prisma/
│   └── schema.prisma             # Database schema
└── public/                       # Static assets
```

## 🔄 Data Flow

### 1. **Server Components (Default)**
- Most pages are Server Components by default
- Direct database access via Prisma
- No client-side JavaScript bundle
- Better SEO and performance

### 2. **Client Components (When Needed)**
- Interactive components (forms, cart, filters)
- State management (Zustand stores)
- User interactions
- Marked with `'use client'` directive

### 3. **API Routes**
- RESTful endpoints for data operations
- Payment webhooks
- External API integrations

## 🗄️ Database Architecture

### Entity Relationships

```
User (1) ──< (N) Order
Order (1) ──< (1) Payment
Order (1) ──< (1) Delivery
Order (1) ──< (N) OrderItem
OrderItem (N) ──< (1) Product
PreMadeBox (1) ──< (N) PreMadeBoxItem
PreMadeBoxItem (N) ──< (1) Product
```

### Order Types
- **PREMADE**: User purchases a pre-made box
- **CUSTOM**: User builds their own box
- **MYSTERY**: System creates a surprise box

## 🔐 Authentication Flow

1. **Email/Password**
   - User registers → Password hashed with bcrypt
   - Login → Credentials validated → JWT session created

2. **Google OAuth**
   - User clicks "Sign in with Google"
   - Redirected to Google → Callback → User created/updated → Session

3. **Session Management**
   - JWT tokens stored in cookies
   - Server-side session validation
   - Protected routes check session

## 🛒 Shopping Flow

### Pre-Made Box
1. Browse boxes → View details → Add to cart → Checkout → Payment → Order created

### Custom Box
1. Browse products → Add to custom box store → Build box → Checkout → Payment → Order created

### Mystery Box
1. Fill form (gender, age, budget, interests) → Submit → Order created (status: PENDING) → Admin curates → Order updated → Payment → Delivery

## 💳 Payment Integration

### Flow
1. Order created → Payment record created (status: PENDING)
2. Create payment session with provider (Payriff/Portmanat)
3. Redirect user to payment provider
4. User completes payment
5. Webhook received → Payment status updated → Order status updated

### Webhook Security
- Verify webhook signature
- Validate payment amount
- Update database transactionally
- Handle idempotency

## 🚀 Performance Optimizations

1. **Server Components**: Reduce client bundle size
2. **Image Optimization**: Next.js Image component
3. **Code Splitting**: Automatic with App Router
4. **Caching**: Next.js built-in caching strategies
5. **Database Indexing**: Prisma indexes on frequently queried fields

## 🔒 Security Considerations

1. **Authentication**: NextAuth with secure session management
2. **Password Hashing**: bcrypt with salt rounds
3. **SQL Injection**: Prisma ORM prevents SQL injection
4. **XSS Protection**: React's built-in escaping
5. **CSRF Protection**: NextAuth handles CSRF tokens
6. **Environment Variables**: Sensitive data in `.env`
7. **Rate Limiting**: Should be added to API routes (future)

## 📦 State Management

### Zustand Stores
- **cart-store**: Shopping cart items (persisted to localStorage)
- **custom-box-store**: Custom box builder items (persisted)

### Server State
- Fetched via Server Components or API routes
- No need for React Query (Next.js handles caching)

## 🧪 Testing Strategy (Future)

1. **Unit Tests**: Jest for utilities and stores
2. **Integration Tests**: API route testing
3. **E2E Tests**: Playwright for critical flows
4. **Database Tests**: Prisma test client

## 📈 Scalability Considerations

1. **Database**: PostgreSQL can scale with read replicas
2. **Caching**: Redis for session storage (future)
3. **CDN**: Vercel Edge Network for static assets
4. **Search**: Meilisearch integration planned
5. **Image Storage**: Cloudinary or AWS S3 (future)

## 🔄 Deployment Strategy

1. **Development**: Local with PostgreSQL
2. **Staging**: Vercel Preview deployments
3. **Production**: Vercel with production database
4. **Database Migrations**: Prisma migrations in CI/CD

## 🛠️ Development Workflow

1. **Feature Development**: Create branch → Develop → Test → PR
2. **Database Changes**: Update schema → Generate migration → Test
3. **API Changes**: Update route → Test with Postman/Thunder Client
4. **UI Changes**: Develop component → Test in isolation → Integrate

## 📝 Code Organization Principles

1. **Co-location**: Related files stay together
2. **Separation of Concerns**: UI, business logic, data access separated
3. **Reusability**: Shared components in `/src/components/ui`
4. **Type Safety**: TypeScript throughout
5. **Consistency**: Follow Next.js and React best practices

## 🎯 Future Enhancements

1. **Admin Dashboard**: Full CRUD for products, orders, users
2. **Corporate Orders**: Bulk ordering functionality
3. **Advanced Search**: Meilisearch integration
4. **Email Notifications**: Order confirmations, tracking updates
5. **Analytics**: Order analytics, product performance
6. **Reviews & Ratings**: Customer feedback system
7. **Wishlists**: Save favorite products/boxes
8. **Gift Messages**: Add messages to gift boxes

