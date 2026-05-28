# 🌐 HostForge — Domain & Hosting Services Platform

> A full-stack multi-tenant platform for selling domain registration, web hosting, VPS, and related services — built with Next.js, Firebase, and Flutterwave.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [User Roles](#4-user-roles)
5. [Page & Feature Flows](#5-page--feature-flows)
   - 5.1 [Public / Guest Flow](#51-public--guest-flow)
   - 5.2 [Customer Flow](#52-customer-flow)
   - 5.3 [Reseller Flow](#53-reseller-flow)
   - 5.4 [Admin Flow](#54-admin-flow)
6. [Database Schema (Firestore)](#6-database-schema-firestore)
7. [API Integrations](#7-api-integrations)
8. [Payment Flow (Flutterwave)](#8-payment-flow-flutterwave)
9. [Project Structure](#9-project-structure)
10. [Environment Variables](#10-environment-variables)
11. [Getting Started](#11-getting-started)
12. [Deployment](#12-deployment)
13. [Roadmap](#13-roadmap)
14. [Contributing](#14-contributing)
15. [License](#15-license)

---

## 1. Project Overview

**HostForge** is a white-label hosting and domain reseller platform. It lets you:

- Register and manage domain names via a domain registrar API (e.g., Namecheap, OpenSRS, or ResellerClub).
- Sell shared hosting, VPS, and SSL certificates.
- Host your own projects under the same infrastructure.
- Allow third-party customers and resellers to purchase services through a branded storefront.
- Process payments in NGN, USD, and other currencies via Flutterwave.

The platform supports three distinct user roles — **Admin**, **Reseller**, and **Customer** — each with their own dashboard, permissions, and workflows.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR/SSG pages, API routes |
| Styling | Tailwind CSS + shadcn/ui | UI components and design system |
| Auth | Firebase Authentication | Email/password, Google OAuth |
| Database | Firestore (NoSQL) | Users, orders, services, invoices |
| Storage | Firebase Storage | Invoices, documents, logos |
| Functions | Firebase Cloud Functions | Webhooks, background jobs |
| Payments | Flutterwave | NGN/USD checkout, subscriptions |
| Domain API | Namecheap API / ResellerClub API | Domain search, registration, DNS |
| Hosting API | cPanel WHM API / Plesk API | Account provisioning, suspension |
| Email | Nodemailer + SendGrid | Transactional emails, invoices |
| Monitoring | Sentry | Error tracking |
| Deployment | Vercel + Firebase Hosting | Frontend + serverless functions |

---

## 3. System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Next.js (Vercel)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Public Site │  │  Customer    │  │  Admin Panel   │  │
│  │  /           │  │  Dashboard   │  │  /admin        │  │
│  │  /domains    │  │  /client  │  │                │  │
│  │  /hosting    │  │              │  │  Reseller Panel│  │
│  │  /pricing    │  │              │  │  /reseller     │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                 │                   │            │
│  ┌──────▼─────────────────▼───────────────────▼────────┐  │
│  │               Next.js API Routes (/api/*)            │  │
│  └──────┬──────────────┬─────────────────┬─────────────┘  │
└─────────┼──────────────┼─────────────────┼────────────────┘
          │              │                 │
   ┌──────▼──────┐ ┌─────▼──────┐  ┌──────▼──────┐
   │  Firebase   │ │Flutterwave │  │ Domain /    │
   │  Auth +     │ │ Payment    │  │ Hosting APIs│
   │  Firestore  │ │ Gateway    │  │ (Namecheap, │
   │  + Storage  │ │            │  │  WHM, etc.) │
   └─────────────┘ └────────────┘  └─────────────┘
```

---

## 4. User Roles

### 4.1 Guest (Unauthenticated)

Visitors who have not yet created an account. They can browse the storefront, search for domain names, and view pricing plans — but cannot purchase without signing up.

### 4.2 Customer

A registered user who purchases services for personal or business use. Customers manage their own domains, hosting accounts, invoices, and support tickets from a self-service dashboard.

### 4.3 Reseller

A registered user who has been granted reseller status (either by self-upgrading to a reseller plan or approved by Admin). Resellers can:

- Set their own pricing margins on top of base prices.
- Manage a sub-set of customers under their account.
- Access a white-label storefront with custom branding.
- View earnings and commission reports.

### 4.4 Admin (Super Admin)

The platform owner. Full access to all users, orders, configurations, and system settings. Can:

- Manage all products, pricing, and promotions.
- Approve/reject reseller applications.
- View platform-wide revenue and analytics.
- Manually provision or suspend any service.
- Manage global DNS, server infrastructure settings.

---

## 5. Page & Feature Flows

---

### 5.1 Public / Guest Flow

#### Landing Page — `/`

- Hero section with domain search bar (live availability check via Domain API)
- Featured hosting plan cards (Starter, Business, Enterprise)
- Why Choose Us section (uptime, support, pricing)
- Testimonials, FAQs, footer with links

#### Domain Search — `/domains`

```
User types domain name
       │
       ▼
API call → Domain Registrar API (Namecheap / ResellerClub)
       │
       ▼
Results page:
  ✅ Available → "Add to Cart" button + price
  ❌ Taken → Show alternatives (.ng, .com.ng, .net, etc.)
       │
       ▼
User clicks "Add to Cart"
       │
       ▼
Redirected to /register or /checkout if already logged in
```

**Pages:**
- `/domains` — Search & browse domains
- `/domains/[tld]` — TLD-specific landing page (e.g., `/domains/ng`)

#### Hosting Plans — `/hosting`

- Shared Hosting plans table
- VPS plans table
- Plan comparison matrix
- "Get Started" CTA per plan → redirects to register/checkout

#### SSL Certificates — `/ssl`

- Certificate type listings (Domain Validated, Organization Validated, Wildcard)
- Pricing per certificate, validity period
- CTA to purchase

#### Pricing — `/pricing`

- Combined pricing page for all services
- Monthly / Annual toggle (with discount badge)
- Currency switcher (NGN / USD)

#### Authentication — `/auth`

- `/auth/register` — Email + password sign-up form, Google OAuth button
- `/auth/login` — Email/password login, Google OAuth, "Forgot password" link
- `/auth/forgot-password` — Send password reset email
- `/auth/verify-email` — Prompt to verify email after registration

**Registration Flow:**

```
Fill form (name, email, password)
       │
       ▼
Firebase createUserWithEmailAndPassword()
       │
       ▼
Send email verification (Firebase)
       │
       ▼
Create user document in Firestore /users/{uid}
  { role: "customer", status: "active", createdAt, ... }
       │
       ▼
Redirect → /client
```

---

### 5.2 Customer Flow

All pages under `/client/*` — protected by auth middleware. Role must be `customer` or `reseller`.

#### Dashboard Home — `/client`

- Summary cards: Active Services, Pending Invoices, Open Tickets, Upcoming Renewals
- Quick action buttons: Register Domain, Upgrade Hosting, Open Ticket
- Recent activity feed

#### My Domains — `/client/domains`

- Table of all registered domains (name, expiry date, auto-renew toggle, status badge)
- Per-domain actions: Manage DNS, Transfer, Renew, Cancel

#### Domain DNS Manager — `/client/domains/[domainId]/dns`

- Add/edit/delete DNS records (A, CNAME, MX, TXT, NS)
- Changes pushed to Domain Registrar API

#### My Hosting — `/client/hosting`

- List of active hosting accounts (package name, server, disk usage bar, bandwidth bar)
- Actions: Login to cPanel, Upgrade Plan, Suspend Request, Cancel

#### My VPS — `/client/vps`

- VPS instance list (IP, OS, RAM, CPU, status indicator)
- Start / Stop / Restart / Rebuild actions via Hosting API
- Console access link (VNC/SSH info)

#### SSL Certificates — `/client/ssl`

- List of purchased certificates with expiry dates
- Download/install instructions

#### Invoices — `/client/invoices`

- Paginated invoice list (invoice #, date, amount, status: Paid / Unpaid / Overdue)
- Click invoice → `/client/invoices/[invoiceId]` for full detail and PDF download
- Pay Now button → Flutterwave checkout

**Invoice Payment Flow:**

```
Customer clicks "Pay Now" on unpaid invoice
       │
       ▼
POST /api/payments/initiate
  { invoiceId, amount, currency, customerEmail }
       │
       ▼
Flutterwave API → generate payment link
       │
       ▼
Redirect to Flutterwave hosted checkout page
       │
       ├── Success → Flutterwave redirects to /client/invoices/[id]?status=success
       │                │
       │                ▼
       │          Webhook: POST /api/webhooks/flutterwave
       │            Verify signature → Update invoice status → Provision service
       │
       └── Failed → Redirect to /client/invoices/[id]?status=failed
```

#### Support Tickets — `/client/support`

- Open ticket list with status badges (Open, In Progress, Resolved, Closed)
- `/client/support/new` — Create ticket form (subject, department, priority, message, attachments)
- `/client/support/[ticketId]` — Thread view with reply box and status updates

#### Account Settings — `/client/settings`

- Profile: name, email, phone, company
- Security: Change password, 2FA toggle (TOTP)
- Notifications: Email preference toggles
- Billing: Saved payment methods, billing address

#### Cart & Checkout — `/checkout`

```
Cart page (/cart)
  List of items (domains, hosting plans, addons)
  Remove item, apply promo code
       │
       ▼
/checkout
  Review order summary
  Enter billing details
  Choose payment method (Flutterwave — card, bank transfer, USSD, mobile money)
       │
       ▼
Flutterwave payment → webhook → order fulfillment
       │
       ▼
/checkout/success — Order confirmation with order number
                    Email receipt sent via SendGrid
```

---

### 5.3 Reseller Flow

Pages under `/reseller/*` — requires role `reseller`.

#### Reseller Dashboard — `/reseller`

- Revenue summary (this month, total)
- Customer count, active services count
- Commission earned
- Quick actions

#### Apply for Reseller — `/reseller/apply` *(for customers upgrading)*

- Reseller plan selection (Bronze, Silver, Gold tiers)
- Business details form
- Submit for admin review

#### Reseller Customers — `/reseller/customers`

- Table of sub-customers linked to this reseller
- Add new customer manually
- View customer's services and invoices

#### Reseller Pricing — `/reseller/pricing`

- View base cost (wholesale) for each product
- Set custom markup per product category
- Changes apply to reseller's storefront

#### Reseller Storefront — `/reseller/storefront`

- Branding settings: logo upload, primary color, custom domain
- Preview button (opens white-label storefront in new tab)

#### White-label Storefront — `/store/[resellerSlug]`

- Same layout as main storefront, but branded with reseller's logo and colors
- Prices reflect the reseller's custom markup
- Payments collected go to reseller's account (minus platform fee)

#### Reseller Earnings — `/reseller/earnings`

- Monthly breakdown of earnings and commissions
- Payout history
- Request withdrawal → triggers Flutterwave Transfer API to reseller's bank

---

### 5.4 Admin Flow

Pages under `/admin/*` — requires role `admin`. Server-side role verification on every request.

#### Admin Dashboard — `/admin`

- Platform overview: Total Revenue, MRR, Active Users, Active Services
- Charts: Revenue over time, New signups, Churn rate
- Alerts: Overdue invoices, pending reseller applications, server alerts

#### User Management — `/admin/users`

- Searchable, filterable table of all users
- Role badge (customer / reseller / admin)
- Actions: View, Suspend, Delete, Change Role, Impersonate (login as user)
- `/admin/users/[userId]` — Detailed user profile, order history, linked services

#### Product Management — `/admin/products`

- CRUD for all products: Hosting Plans, Domain TLDs, VPS Plans, SSL Certs
- Set base price, cost price, billing cycle
- Enable/disable products

#### Domain TLD Pricing — `/admin/products/domains`

- TLD list with registration/renewal/transfer prices
- Enable/disable specific TLDs
- Sync prices from registrar API

#### Order Management — `/admin/orders`

- All orders across all users (sortable, filterable by status and date)
- Manual order fulfillment (if auto-provisioning failed)
- Refund initiation

#### Invoice Management — `/admin/invoices`

- All invoices (filter by status, user, date range)
- Mark invoice as Paid manually
- Send invoice reminder email

#### Reseller Management — `/admin/resellers`

- Pending reseller applications → Approve / Reject with reason
- Active resellers list
- View each reseller's sub-customers and revenue
- Set commission rates per reseller tier

#### Server Management — `/admin/servers`

- List of configured WHM/cPanel or Plesk servers
- Add new server (hostname, credentials, max accounts)
- View per-server resource usage

#### Promo Codes — `/admin/promotions`

- Create/edit discount codes (% or fixed, per-product or global, expiry date, usage limits)
- Usage stats per code

#### Support Tickets — `/admin/support`

- All open tickets across all users
- Assign ticket to staff member
- Reply in thread, change status, add internal note

#### Platform Settings — `/admin/settings`

- Company info: name, logo, address, support email
- Payment gateways: Flutterwave API keys (live / test toggle)
- Email settings: SMTP / SendGrid credentials
- Domain Registrar API keys
- Hosting API credentials
- Maintenance mode toggle

#### Audit Logs — `/admin/logs`

- Timestamped log of all admin and system actions
- Filterable by user, action type, date

---

## 6. Database Schema (Firestore)

```
/users/{userId}
  uid: string
  email: string
  displayName: string
  phone: string
  role: "customer" | "reseller" | "admin"
  resellerId: string | null          // populated if customer belongs to a reseller
  status: "active" | "suspended"
  createdAt: timestamp

/resellers/{resellerId}
  userId: string
  slug: string                       // for white-label URL
  brandName: string
  logoUrl: string
  primaryColor: string
  tier: "bronze" | "silver" | "gold"
  commissionRate: number
  status: "pending" | "active" | "rejected"
  customDomain: string | null
  createdAt: timestamp

/products/{productId}
  type: "domain" | "hosting" | "vps" | "ssl"
  name: string
  description: string
  basePrice: number
  costPrice: number
  currency: "NGN" | "USD"
  billingCycle: "monthly" | "annual" | "once"
  isActive: boolean
  metadata: object                   // plan-specific details (disk, bandwidth, etc.)

/orders/{orderId}
  userId: string
  resellerId: string | null
  items: [{ productId, name, price, quantity, meta }]
  subtotal: number
  discount: number
  total: number
  currency: string
  status: "pending" | "paid" | "failed" | "refunded"
  invoiceId: string
  createdAt: timestamp

/invoices/{invoiceId}
  invoiceNumber: string              // e.g., INV-2024-00123
  userId: string
  orderId: string
  amount: number
  currency: string
  status: "unpaid" | "paid" | "overdue" | "refunded"
  dueDate: timestamp
  paidAt: timestamp | null
  flutterwaveRef: string | null
  pdfUrl: string | null
  createdAt: timestamp

/services/{serviceId}
  userId: string
  orderId: string
  type: "domain" | "hosting" | "vps" | "ssl"
  status: "active" | "suspended" | "expired" | "cancelled"
  domain: string | null
  serverUsername: string | null      // cPanel username
  ipAddress: string | null
  expiryDate: timestamp
  autoRenew: boolean
  meta: object                       // type-specific data
  createdAt: timestamp

/tickets/{ticketId}
  userId: string
  subject: string
  department: "billing" | "technical" | "sales" | "abuse"
  priority: "low" | "medium" | "high" | "critical"
  status: "open" | "in_progress" | "resolved" | "closed"
  assignedTo: string | null
  createdAt: timestamp
  updatedAt: timestamp

/tickets/{ticketId}/messages/{messageId}
  senderId: string
  senderRole: "customer" | "admin"
  message: string
  attachments: string[]
  isInternal: boolean                // internal admin notes
  createdAt: timestamp

/payments/{paymentId}
  userId: string
  invoiceId: string
  provider: "flutterwave"
  transactionRef: string
  amount: number
  currency: string
  status: "success" | "failed" | "pending"
  webhookVerified: boolean
  createdAt: timestamp

/promoCodes/{codeId}
  code: string
  discountType: "percent" | "fixed"
  discountValue: number
  applicableTo: "all" | string[]     // product IDs
  usageLimit: number | null
  usageCount: number
  expiresAt: timestamp | null
  isActive: boolean
```

---

## 7. API Integrations

### 7.1 Domain Registrar — Namecheap API

Used for domain availability checks, registration, renewal, transfers, and DNS management.

| Endpoint | Purpose |
|---|---|
| `namecheap.domains.check` | Check domain availability |
| `namecheap.domains.create` | Register a new domain |
| `namecheap.domains.renew` | Renew a domain |
| `namecheap.domains.transfer.create` | Initiate a domain transfer |
| `namecheap.domains.dns.setHosts` | Update DNS records |
| `namecheap.domains.getInfo` | Get domain info and status |

> **Alternative:** ResellerClub / Logicboxes API (REST-based, better for African resellers).

### 7.2 Hosting Provisioning — WHM/cPanel API

Used to automate hosting account creation, suspension, and resource monitoring.

| Endpoint | Purpose |
|---|---|
| `createacct` | Create a new cPanel account |
| `suspendacct` | Suspend a hosting account |
| `unsuspendacct` | Reactivate a hosting account |
| `removeacct` | Delete an account |
| `accountsummary` | Get account resource usage |
| `changepackage` | Upgrade/downgrade hosting plan |

> **Alternative:** Plesk XML API or WHMCS API for full lifecycle management.

### 7.3 Email — SendGrid / Nodemailer

All transactional emails are sent via SendGrid (production) or Nodemailer with SMTP (development).

**Email triggers:**
- Account registration welcome email
- Email verification
- Password reset
- Invoice generated / payment received
- Service expiry reminders (3 days, 1 day before expiry)
- Support ticket opened / replied to
- Reseller application approved/rejected

### 7.4 SSL Issuance — ZeroSSL API / Sectigo Reseller API

For automated SSL certificate issuance (Domain Validated) and fulfilment.

### 7.5 Geolocation / Currency — ExchangeRate-API

Used to auto-detect user currency (NGN for Nigerian users, USD for others) and display localized pricing.

---

## 8. Payment Flow (Flutterwave)

### 8.1 Supported Payment Methods

- Credit / Debit Card (Visa, Mastercard, Verve)
- Bank Transfer (Nigerian banks)
- USSD
- Mobile Money (Ghana, Kenya, Uganda, Tanzania)
- M-Pesa

### 8.2 Initiating a Payment

```javascript
// POST /api/payments/initiate
// Called when customer clicks "Pay Now"

const payload = {
  tx_ref: `INV-${invoiceId}-${Date.now()}`,
  amount: invoice.amount,
  currency: invoice.currency,       // "NGN" or "USD"
  redirect_url: `${BASE_URL}/client/invoices/${invoiceId}`,
  customer: {
    email: user.email,
    name: user.displayName,
    phonenumber: user.phone,
  },
  customizations: {
    title: "HostForge Payment",
                      Email receipt sent via Nodemailer (SMTP)
    logo: `${BASE_URL}/logo.png`,
  },
  meta: {
    invoiceId,
    userId: user.uid,
  },
};

const response = await flutterwave.Payment.initiate(payload);
// Redirect user to: response.data.link
```

### 8.3 Webhook Verification

```javascript
// POST /api/webhooks/flutterwave
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=HostForge
  const signature = req.headers.get("verif-hash");

  // 1. Verify signature against FLW_SECRET_HASH env variable
  if (signature !== process.env.FLW_SECRET_HASH) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = await req.json();

  if (event.event === "charge.completed" && event.data.status === "successful") {
    const { invoiceId, userId } = event.data.meta;

    // 2. Update Firestore invoice status → "paid"
    // 3. Create payment record
    // 4. Trigger service provisioning (Cloud Function)
    // 5. Send confirmation email
  }

  return new Response("OK", { status: 200 });
}
```

### 8.4 Reseller Payouts

Resellers request payouts from `/reseller/earnings`. This triggers a Flutterwave Transfer:

```javascript
// POST /api/reseller/payout
await flutterwave.Transfer.initiate({
  account_bank: reseller.bankCode,
  account_number: reseller.accountNumber,
  amount: requestedAmount,
  currency: "NGN",
  narration: "HostForge Reseller Payout",
  reference: `PAYOUT-${resellerId}-${Date.now()}`,
});
```

---

## 9. Project Structure

```
hostforge/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public pages (no auth)
│   │   ├── page.tsx              # Landing page
│   │   ├── domains/page.tsx
│   │   ├── hosting/page.tsx
│   │   ├── pricing/page.tsx
│   │   └── ssl/page.tsx
│   ├── auth/                     # Auth pages
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── dashboard/                # Customer dashboard
│   │   ├── layout.tsx            # Auth guard + sidebar
│   │   ├── page.tsx
│   │   ├── domains/
│   │   ├── hosting/
│   │   ├── vps/
│   │   ├── invoices/
│   │   ├── support/
│   │   └── settings/
│   ├── reseller/                 # Reseller dashboard
│   │   ├── layout.tsx            # Reseller role guard
│   │   ├── page.tsx
│   │   ├── customers/
│   │   ├── pricing/
│   │   ├── storefront/
│   │   └── earnings/
│   ├── store/[slug]/             # White-label reseller storefront
│   ├── admin/                    # Admin panel
│   │   ├── layout.tsx            # Admin role guard
│   │   ├── page.tsx
│   │   ├── users/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── invoices/
│   │   ├── resellers/
│   │   ├── servers/
│   │   ├── support/
│   │   ├── promotions/
│   │   ├── logs/
│   │   └── settings/
│   ├── cart/page.tsx
│   ├── checkout/
│   │   ├── page.tsx
│   │   └── success/page.tsx
│   └── api/                      # Next.js API routes
│       ├── domains/
│       │   ├── search/route.ts
│       │   └── register/route.ts
│       ├── hosting/
│       │   └── provision/route.ts
│       ├── payments/
│       │   └── initiate/route.ts
│       ├── webhooks/
│       │   └── flutterwave/route.ts
│       └── admin/
│           └── impersonate/route.ts
│
├── components/
│   ├── ui/                       # shadcn/ui base components
│   ├── layout/                   # Navbar, Sidebar, Footer
│   ├── dashboard/                # Dashboard-specific components
│   ├── checkout/                 # Cart, checkout form
│   ├── domains/                  # Domain search, DNS manager
│   └── admin/                   # Admin-specific components
│
├── lib/
│   ├── firebase/
│   │   ├── client.ts             # Firebase client SDK init
│   │   ├── admin.ts              # Firebase Admin SDK init
│   │   └── auth.ts               # Auth helpers
│   ├── flutterwave/
│   │   └── client.ts             # Flutterwave SDK wrapper
│   ├── namecheap/
│   │   └── client.ts             # Namecheap API wrapper
│   ├── whm/
│   │   └── client.ts             # WHM/cPanel API wrapper
│   ├── email/
│   │   └── sender.ts             # SendGrid email sender
│   └── utils.ts                  # General utilities
│
├── hooks/
│   ├── useAuth.ts                # Auth context hook
│   ├── useCart.ts                # Cart state hook
│   └── useRole.ts                # Role-based access hook
│
├── middleware.ts                 # Next.js middleware (route protection)
├── types/
│   └── index.ts                  # Global TypeScript types
├── constants/
│   └── plans.ts                  # Plan definitions, pricing
├── .env.local                    # Environment variables (see below)
├── .env.example
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
└── package.json
```

---

## 10. Environment Variables

Create a `.env.local` file in the project root. See `.env.example` for a full template.

```bash
# --- App ---
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=HostForge

# --- Firebase (Client SDK) ---
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# --- Firebase (Admin SDK — server only) ---
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=          # Wrap value in double quotes

# --- Flutterwave ---
NEXT_PUBLIC_FLW_PUBLIC_KEY=          # Used in client for inline payment
FLW_SECRET_KEY=                      # Server only
FLW_SECRET_HASH=                     # Webhook verification hash
FLW_ENCRYPT_KEY=                     # For encryption (optional)

# --- Namecheap API ---
NAMECHEAP_API_USER=
NAMECHEAP_API_KEY=
NAMECHEAP_USERNAME=
NAMECHEAP_CLIENT_IP=                 # Your server's IP (whitelisted in Namecheap)
NAMECHEAP_SANDBOX=true               # Set to false in production

# --- WHM / cPanel API ---
WHM_API_URL=https://your-server.com:2087
WHM_API_TOKEN=                       # WHM API token (not password)

# --- SendGrid ---
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=HostForge

# --- Sentry ---
NEXT_PUBLIC_SENTRY_DSN=

# --- Exchange Rate API ---
EXCHANGE_RATE_API_KEY=
```

---

## 11. Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- A Flutterwave account (test mode is fine for development)
- A Namecheap account with API access enabled (sandbox available)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/hostforge.git
cd hostforge

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Initialize Firebase
firebase login
firebase init                        # Select Firestore, Storage, Functions

# 5. Deploy Firestore security rules
firebase deploy --only firestore:rules

# 6. Start the development server
npm run dev

---

## Using shadcn/ui

This project uses [shadcn/ui](https://ui.shadcn.com/) for its component library and design system. All custom UI components are located in `components/ui/`. You can extend or customize them as needed. See the [shadcn/ui docs](https://ui.shadcn.com/docs) for usage and theming instructions.
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Creating the First Admin User

1. Register a regular account at `/auth/register`.
2. In the Firebase Console → Firestore → `users` collection, find your user document.
3. Change the `role` field from `"customer"` to `"admin"`.
4. Refresh the app — you now have admin access at `/admin`.

> In production, automate this with a Firebase CLI script or a one-time setup script (`scripts/seed-admin.ts`).

---

## 12. Deployment

### Frontend — Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# Settings → Environment Variables → add all from .env.local
```

### Firebase Cloud Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

### Firestore Security Rules

Ensure `firestore.rules` is configured to restrict access by role. Example rule snippet:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Admins can read all users
    match /users/{userId} {
      allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Invoices — readable by owner and admins
    match /invoices/{invoiceId} {
      allow read: if request.auth.uid == resource.data.userId
        || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

---

## 13. Roadmap

- [x] Domain search and registration
- [x] Shared hosting provisioning (WHM)
- [x] Flutterwave payment integration
- [x] Invoice generation and PDF export
- [x] Customer dashboard
- [x] Admin panel
- [x] Reseller system with white-label storefronts
- [ ] VPS provisioning (Hetzner / DigitalOcean API)
- [ ] Automated SSL issuance (ZeroSSL)
- [ ] Affiliate program module
- [ ] Live chat widget integration (Crisp / Intercom)
- [ ] Native mobile app (React Native)
- [ ] Subscription billing with recurring payments (Flutterwave recurring)
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard (revenue, churn, LTV)
- [ ] WHMCS migration import tool

---

## 14. Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`.

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

---

## 15. License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

> Built with ❤️ for the African hosting market. Powered by Next.js, Firebase & Flutterwave.