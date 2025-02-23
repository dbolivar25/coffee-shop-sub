# Coffee Shop Subscription App

A digital subscription system built with Next.js, using Clerk for authentication and Supabase for the database. Customers receive QR codes that staff can scan to verify and redeem drinks.

## System Overview

### Technical Stack
- Next.js 14 (App Router)
- Clerk for authentication
- Supabase for database
- QR code generation using `qrcode.react`
- TailwindCSS for styling

### Core Features
- Customer subscription management
- QR code generation for redemptions
- Staff verification interface
- Automatic daily drink reset
- Dark mode support

### Database Structure
```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Subscriptions table
create table subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null unique,
    daily_drinks_remaining integer default 3,
    last_reset_date timestamp with time zone default now(),
    created_at timestamp with time zone default now()
);

-- Redemptions table
create table redemptions (
    id uuid default uuid_generate_v4() primary key,
    subscription_id uuid references subscriptions(id),
    created_at timestamp with time zone default now()
);

-- Enable RLS
alter table subscriptions enable row level security;
alter table redemptions enable row level security;

-- RLS Policies
create policy "Users can view own subscription"
    on subscriptions for select
    using (auth.jwt() ->> 'sub' = user_id);

create policy "Admins can update subscriptions"
    on subscriptions for all
    using (auth.jwt() ->> 'clerk_role' = 'admin');

create policy "Admins can manage redemptions"
    on redemptions for all
    using (auth.jwt() ->> 'clerk_role' = 'admin');
```

### API Routes
1. Subscription Management
   - GET /api/subscription - Get user's subscription
   - POST /api/subscription - Create new subscription

2. Staff Verification
   - GET /api/verify/[subscriptionId] - Verify subscription
   - POST /api/redeem/[subscriptionId] - Redeem a drink

### Automatic Reset System
```sql
-- Enable pg_cron
create extension if not exists pg_cron;

-- Create reset function
create or replace function public.reset_daily_drinks()
returns void as $$
begin
  update subscriptions 
  set daily_drinks_remaining = 3,
      last_reset_date = current_timestamp
  where last_reset_date < current_date;
end;
$$ language plpgsql;

-- Schedule midnight reset
select cron.schedule(
  'reset-drinks',
  '0 0 * * *',
  'select public.reset_daily_drinks();'
);
```

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Features

### Customer Features
- Sign up/login with Clerk
- Purchase subscription (mock payment)
- View subscription status
- Generate QR code for redemption
- Track remaining daily drinks

### Staff Features
- Scan customer QR codes
- Verify subscription status
- Process drink redemptions
- View customer drink entitlements

### System Features
- Automatic midnight drink reset
- Row Level Security in database
- Role-based access control
- Dark mode support
- Responsive design

## Security

- Authentication via Clerk
- Database RLS policies
- Protected API routes
- Admin-only verification pages
- Secure QR code generation

## Development

### File Structure
```
src/
├── app/
│   ├── api/              # API routes
│   ├── subscription/     # Customer dashboard
│   ├── verify/          # Staff verification
│   └── lib/             # Shared utilities
```

### Key Components
- `subscription/page.tsx` - Customer dashboard
- `verify/[subscriptionId]/page.tsx` - Staff verification
- `lib/db.ts` - Database utilities
- `middleware.ts` - Route protection

## Deployment

The app can be deployed on Vercel with:
- Clerk for authentication
- Supabase for database
- Vercel for hosting

## Future Enhancements
- Real payment processing
- Email notifications
- Usage analytics
- Staff management interface
- Customer purchase history
