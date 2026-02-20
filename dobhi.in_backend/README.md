# dobhi.in_backend

Backend API for `dobhivala` frontend.

## Run

```bash
npm install
npm run dev
```

Server default: `http://localhost:5000`

## Environment

Copy `.env.example` to `.env` and update values.

Required for boot:
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`

Required for contact email notifications/replies:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
- `CONTACT_RECEIVER_EMAIL`

## Security & Validation

- `helmet` security headers enabled
- Global rate limit enabled
- Auth endpoints have stricter rate limit
- Route-level request validation with `zod`

## API Overview

Public:
- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/admin/login`
- `GET /api/services`
- `GET /api/settings`
- `POST /api/contact`

Customer (Bearer token):
- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders/:id`
- `POST /api/ratings`

Admin (Bearer token):
- `PUT /api/services` (bulk replace)
- `POST /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`
- `PUT /api/settings`
- `GET /api/orders/admin/all`
- `PATCH /api/orders/admin/:id/status`
- `DELETE /api/orders/admin/:id`
- `GET /api/ratings/admin/all`
- `DELETE /api/ratings/admin/:id`
- `GET /api/customers`
- `GET /api/contact`
- `PATCH /api/contact/:id`
- `POST /api/contact/:id/reply`

## Tests

```bash
npm test
```

Current tests:
- health endpoint
- auth payload validation

## Notes

- Auth uses MongoDB (`users` collection).
- Admin seed auto-creates on first admin login attempt:
  - email: `admin@dhobi.in`
  - password: `admin123`
- Change admin credentials before production.
