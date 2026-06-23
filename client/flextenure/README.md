# Flextenure

A MoneyView-style loan marketplace — compare loans, check eligibility, calculate EMIs, track applications, and check your credit score. Built on the MERN stack (MongoDB, Express, React, Node.js).

This project picks up from a half-finished frontend and adds everything needed to run it end-to-end: a complete Express + MongoDB backend, the missing pages and entry files on the frontend, and two file-naming bugs that would have broken the build on any case-sensitive filesystem (Linux servers, Vercel, Netlify, etc.).

## What was already there

A polished React frontend: Home, Loans, Loan Detail, Eligibility Checker, EMI Calculator, Dashboard, Login, and Register — all styled, all wired up to call a backend API.

## What's been added

**Backend (all new):**
- Express server with MongoDB/Mongoose models for `User`, `LoanProduct`, and `Application`
- JWT authentication (register, login, protected routes)
- `POST /api/eligibility/check` — scoring logic based on age, income, credit score, and employment type
- `GET /api/loans` and `GET /api/loans/:type` — backed by a seed script with the 6 loan products
- `GET`/`POST /api/applications` — protected, scoped to the logged-in user
- `GET /api/credit-score` — a derived, per-user credit report (score, 6-month trend, factor breakdown, tips)

**Frontend (filled in):**
- `src/index.js` and `public/index.html` — the app had no entry point or HTML shell
- `src/pages/CreditScore.js` + `.css` — linked from the navbar, footer, and dashboard, but the page itself didn't exist yet
- Reorganized the flat file dump into the `components/ `, `pages/`, and `context/` folders that `App.js` already expects

**Two bugs fixed:**
- `Eligibilitychecker.css` → renamed to `EligibilityChecker.css` (the component imports it with a capital C — this only "works" on Windows/Mac, which ignore case, and silently fails on Linux)
- `Loandetail.css` → renamed to `LoanDetail.css` for the same reason, and the file itself renamed to `LoanDetail.js` to match `App.js`'s import

## Project structure

```
flextenure/
├── client/                 # React frontend (Create React App)
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/     # Navbar, Footer
│       ├── context/        # AuthContext (login/register/logout, JWT storage)
│       ├── pages/          # Home, Loans, LoanDetail, EligibilityChecker,
│       │                   # EMICalculator, CreditScore, Dashboard, Login, Register
│       ├── App.js
│       └── index.js
└── server/                 # Express + MongoDB backend
    ├── config/db.js        # Mongoose connection
    ├── middleware/auth.js  # JWT route protection
    ├── models/              # User, LoanProduct, Application
    ├── routes/              # auth, loans, eligibility, applications, credit-score
    ├── utils/               # eligibility scoring, credit report, token/id generators
    ├── seed.js              # loads the 6 loan products into MongoDB
    └── server.js
```

## Setup

You'll need Node.js 18+ and a MongoDB database — either running locally or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

### 1. Install dependencies

```bash
npm run install-all
```

(Or manually: `cd server && npm install`, then `cd ../client && npm install`.)

### 2. Configure the backend

```bash
cd server
cp .env.example .env
```

Open `.env` and set:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string (used to sign login tokens)

### 3. Seed the loan products

The Loans and Loan Detail pages read from the database, so run this once:

```bash
npm run seed
```

### 4. Run the app

From the project root:

```bash
npm run dev
```

This starts the API on `http://localhost:5000` and the React app on `http://localhost:3000` (which proxies `/api/*` calls to the server automatically — see `client/package.json`'s `proxy` field).

Or run them separately in two terminals:

```bash
npm run server   # API on :5000
npm run client   # React app on :3000
```

## API reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create an account, returns `{ token, user }` |
| POST | `/api/auth/login` | — | Log in, returns `{ token, user }` |
| GET | `/api/auth/me` | ✓ | Get the current user |
| GET | `/api/loans` | — | List all loan products |
| GET | `/api/loans/:type` | — | Get one loan product, e.g. `/api/loans/personal` |
| POST | `/api/eligibility/check` | — | Check eligibility, returns score/offers/tips |
| GET | `/api/applications` | ✓ | List the current user's loan applications |
| POST | `/api/applications` | ✓ | Submit a new loan application |
| GET | `/api/applications/:id` | ✓ | Get one application |
| GET | `/api/credit-score` | ✓ | Get the current user's credit report |

Protected routes expect `Authorization: Bearer <token>`. The frontend's `AuthContext` already sets this header on `axios` automatically after login/register.

## Notes for going further

- **Credit scores are simulated.** There's no real CIBIL/Experian/Equifax integration — each user gets a random demo score at signup, and the credit report (trend, factor breakdown) is derived from it deterministically. Wiring up a real bureau requires a commercial agreement and KYC compliance, so that's out of scope here.
- **No real lender integrations.** The "offers" returned by the eligibility checker are illustrative, not live rate cards from actual banks.
- **Password reset and OTP login** are shown in the UI (the "Forgot password?" link, "OTP Login" button) but aren't wired to a backend yet — they're good next features to build.
- **Document uploads** on the Dashboard's Documents tab are UI-only placeholders; wiring them up would mean adding file storage (e.g. S3) and a documents collection.
