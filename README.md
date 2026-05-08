# AsoEbi Operations Dashboard

A private admin dashboard for managing groomsmen logistics — payment tracking, receipt uploads, and tailoring pipeline.

## Stack
- **Next.js 14** (App Router)
- **Tailwind CSS** (navy + gold theme)
- **Upstash Redis** (database)
- **Uploadthing** (PDF/receipt uploads, max 10MB)
- **NextAuth.js** (two-admin credential auth)
- **Vercel** (hosting)

---

## Setup in 4 Steps

### 1. Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/aso-ebi-operations.git
cd aso-ebi-operations
npm install
```

### 2. Set up services

**Upstash Redis**
- Go to https://console.upstash.com
- Create a Redis database
- Copy the REST URL and REST Token

**Uploadthing**
- Go to https://uploadthing.com
- Create an app
- Copy the Secret and App ID

### 3. Add environment variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
UPLOADTHING_SECRET=your_secret
UPLOADTHING_APP_ID=your_app_id
NEXTAUTH_SECRET=any_random_32_char_string
NEXTAUTH_URL=http://localhost:3000
ADMIN_1_USER=damilola
ADMIN_1_PASS=your_strong_password
ADMIN_2_USER=admin2
ADMIN_2_PASS=their_strong_password
```

Generate a NEXTAUTH_SECRET with:
```bash
openssl rand -base64 32
```

### 4. Run locally
```bash
npm run dev
```
Visit http://localhost:3000

---

## Deploy to Vercel

1. Push to GitHub
2. Go to https://vercel.com → Import project from GitHub
3. Add all environment variables from `.env.local` in Vercel dashboard
   - Change `NEXTAUTH_URL` to your Vercel URL (e.g. `https://aso-ebi-operations.vercel.app`)
4. Deploy — every push to `main` auto-deploys

---

## Features

- **Login** — two admin accounts, credential-based
- **Stats bar** — total collected, outstanding, in-Abuja count
- **Tailoring pipeline** — visual progress across 7 stages
- **Groomsmen table** — all records, sortable, filterable
- **Add groomsman** — name, phone, amount owed, notes
- **Edit groomsman** — update payment, tailoring status, upload receipt PDF
- **Receipt upload** — PDF or image, max 10MB, stored on Uploadthing CDN
- **Delete** — remove a groomsman with confirmation
- **Payment auto-status** — Unpaid / Partial / Paid derived from amounts automatically

---

## Tailoring Stages (in order)
1. Awaiting Measurements
2. Virtual Measurement Scheduled
3. Measurements Taken
4. Clothes Being Made
5. Clothes Ready
6. Sent to Abuja
7. In Abuja ✓

---

## File Structure
```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── groomsmen/route.ts
│   │   ├── groomsmen/[id]/route.ts
│   │   └── upload/route.ts
│   ├── login/page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── providers.tsx
├── components/
│   ├── Dashboard.tsx
│   ├── StatsBar.tsx
│   ├── TailoringProgress.tsx
│   ├── AddGroomsmanModal.tsx
│   └── EditGroomsmanModal.tsx
├── lib/
│   ├── auth.ts
│   ├── redis.ts
│   ├── uploadthing.ts
│   └── uploadthing-client.ts
└── types/
    └── index.ts
```
