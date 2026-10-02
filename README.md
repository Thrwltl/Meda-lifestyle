# MeDa Lifestyle (starter)
Next.js + TypeScript + Prisma/PostgreSQL + eSewa + Khalti + Groq.

## Run
1. `cp .env.example .env` and fill values (DATABASE_URL, NEXTAUTH_SECRET, GROQ_API_KEY)
2. `npm install && npx prisma db push && npm run dev`

## Deploy (Vercel + Neon/Supabase Postgres)
Push to GitHub, import in Vercel, add every variable from `.env.example`, set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to your live domain. Build command `npm run build` already runs `prisma generate`. Railway/Render: same variables, start with `npm start`.

## eSewa
Test: product code `EPAYTEST`, secret `8gBm/:&EA^EQ`, test ID 9806800001, password `Nepal@123`, OTP 123456.
Flow: POST `/api/payments/esewa/initiate {orderId}` returns `{url, fields}`; the client builds a hidden form and POSTs it to `url`. eSewa redirects to `/api/payments/esewa/verify?data=...` where the HMAC-SHA256 signature, status and amount are checked before the order is marked PAID. For live, set your merchant code, secret and `https://epay.esewa.com.np/api/epay/main/v2/form`.

## Khalti
Get a secret key at test-admin.khalti.com (live: khalti.com merchant). Test ID 9800000000-9800000005, MPIN 1111, OTP 987654.
Flow: POST `/api/payments/khalti/initiate {orderId}` returns `{url}` to redirect to; Khalti returns to `/api/payments/khalti/verify?pidx=...`, which calls the lookup API and requires status `Completed` and a matching amount. For live set `KHALTI_BASE_URL=https://khalti.com/api/v2`.

## Groq
`/api/assistant` powers the styling assistant (`mode` omitted) and product description writer (`mode: "describe"`) using `llama-3.3-70b-versatile`. Keep the key server-side only.

## Auth & checkout (added)
- NextAuth credentials + JWT sessions with `role`; `middleware.ts` guards `/account`, `/checkout` and `/admin` (admin only). Make an admin by setting `role = 'ADMIN'` on a user in the DB.
- `POST /api/orders` re-prices items from the DB, decrements stock atomically in a transaction, applies coupons, then adds 13% VAT and shipping (NPR 150, free over NPR 5,000). COD orders stay PENDING/UNPAID; eSewa/Khalti orders flip to CONFIRMED/PAID only after server-side verification.

## Storefront (added)
`/shop` (search, category, brand, price, rating, sort via URL params), `/product/[id]` (gallery, stock, reviews, related, JSON-LD), `/cart`. `npm run db:seed` loads sample products, coupon `WELCOME10` and an admin (`admin@meda.com.np` / `ChangeMe123!`, change immediately). Reviews are limited to buyers with a delivered order. `sitemap.xml` and `robots.txt` are generated.
