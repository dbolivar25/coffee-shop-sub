This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `app/page.tsx`. The page
auto-updates as you edit the file.

This project uses
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to automatically optimize and load [Geist](https://vercel.com/font), a new font
family for Vercel.

## App Description

### Coffee Shop Subscription MVP Project Plan (Next.js + Clerk)

### System Overview

A basic digital subscription system built with Next.js, using Clerk for
authentication. Customers receive QR codes that staff can scan to verify and
redeem drinks. Payment processing will be mocked for the presentation.

### Technical Stack

- Next.js for frontend and API routes
- Clerk for authentication and user management
- Prisma or SQL for database
- QR code generation using `qrcode` library

### Core Components

#### Database Structure

```sql
-- Using timestamps and proper relations
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    daily_drinks_remaining INTEGER DEFAULT 3,
    last_reset_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TABLE redemptions (
    id TEXT PRIMARY KEY,
    subscription_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(subscription_id) REFERENCES subscriptions(id)
);
```

#### API Routes

1. Subscription Management

   - POST /api/subscription/create (mocked payment)
   - GET /api/subscription/status
   - POST /api/subscription/redeem

2. Admin Verification
   - GET /api/admin/verify/:userId
   - POST /api/admin/redeem/:userId

### Implementation Plan

#### Day 1 (Already Complete)

- ✓ Set up Next.js project
- ✓ Integrate Clerk authentication

#### Day 2-3

1. Database Setup

   - Set up database schema
   - Create database utility functions
   - Test database connections

2. Core Customer Features
   - Customer dashboard page
   - QR code generation
   - Mock subscription purchase

#### Day 4-5

1. Admin Features

   - Admin role checking through Clerk
   - Verification page
   - Redemption functionality

2. Daily Reset System
   - Reset drink count at midnight
   - Track redemption history

#### Day 6-7

- Manual testing
- Bug fixes
- UI polish
- Presentation preparation

### Required Features

#### Customer Dashboard

- Display subscription status
- Show QR code
- Show remaining drinks
- Mock payment button

#### Admin Verification

- Protected by Clerk admin role
- Show customer details
- Display remaining drinks
- Redemption confirmation button

### Security Considerations

- Use Clerk's built-in RBAC for admin protection
- Middleware to protect admin routes
- API route protection
- Input validation on all endpoints

### Manual Testing Checklist

#### Auth Flow

- Sign up with Clerk
- Sign in with Clerk
- Admin role assignment works

#### Customer Flow

- Purchase mock subscription
- View dashboard
- Generate QR code
- Track drink count

#### Admin Flow

- Access admin pages
- Scan/enter QR code
- View customer details
- Process redemption
- Verify drink count updates

#### System Tests

- Daily reset works
- QR codes are valid
- Admin protection works
- Rate limiting works

### Definition of Done

1. Customer can:

   - Sign up/login
   - Get a subscription (mocked)
   - View their QR code
   - See remaining drinks

2. Admin can:

   - Login with admin privileges
   - Access verification page
   - Process drink redemptions
   - See customer details

3. System requirements:
   - Daily drink limits enforced
   - Midnight reset works
   - All core flows functional
   - No critical bugs

### Next Steps

1. Database setup
2. Customer dashboard implementation
3. QR code generation
4. Admin verification page

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out
[the Next.js GitHub repository](https://github.com/vercel/next.js) - your
feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our
[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
for more details.
