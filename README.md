# Outbound Marketing & Lead Management Platform

A mini outbound marketing SaaS platform built with **React + TypeScript + Tailwind CSS** on the frontend and **Node.js + Express.js + TypeScript** on the backend.

The platform provides complete end-to-end outbound pipeline management: prospect lead scoring, multi-step sequence email automation, email activity tracking (opens, clicks, replies, bounces), and detailed analytics.

---

## 🎨 UI Aesthetic & Theme
- **Theme**: Pure **Light Mode UI** (`#f8fafc` background, slate typography, crisp white cards, subtle borders, indigo accents).
- **Strict Requirement**: Zero dark backgrounds or dark pages throughout the entire application.

---

## ⚡ How to Run (Single Command)

You can run both Backend and Frontend together with **one single command**:

```bash
# Clone / navigate to project root directory
cd /Users/harshithayadav/Desktop/Outlook

# Run full-stack application (starts both backend & frontend concurrently)
npm run dev
```

- **Web Application**: **http://localhost:3000**
- **Backend REST API**: **http://localhost:5001**

### 🔑 Demo Login Credentials
- **Email**: `alex@outboundio.com`
- **Password**: `password123`

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM v6

### Backend
- **Runtime**: Node.js v24 + Express.js + TypeScript
- **Database**: Dual MySQL (`schema.sql`) / SQLite embedded (`better-sqlite3`) with WAL journal mode for instant local execution
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs` password hashing

---

## 🚀 Application Architecture

```
                    OUTBOUND MARKETING PLATFORM
                              |
             +----------------+----------------+
             |                                 |
          FRONTEND                         BACKEND
             |                                 |
       React + TS                         Node.js
       Tailwind CSS                      Express.js
             |                                 |
             +------------ REST API -----------+
                              |
                        MySQL / SQLite
                              |
             +----------------+----------------+
             |                |                |
           Users            Leads          Campaigns
                                             |
                                      Email Sequences
                                             |
                                      Email Tracking
                                             |
                                          Analytics
```

### Backend Directory Layout (`/backend`)
```
backend/
├── schema.sql
├── package.json
├── tsconfig.json
└── src/
    ├── config/
    │   ├── database.ts
    │   └── environment.ts
    ├── controllers/
    │   ├── auth.controller.ts
    │   ├── lead.controller.ts
    │   ├── campaign.controller.ts
    │   ├── email.controller.ts
    │   └── analytics.controller.ts
    ├── routes/
    │   ├── auth.routes.ts
    │   ├── lead.routes.ts
    │   ├── campaign.routes.ts
    │   ├── email.routes.ts
    │   └── analytics.routes.ts
    ├── services/
    │   ├── auth.service.ts
    │   ├── lead.service.ts
    │   ├── campaign.service.ts
    │   ├── email.service.ts
    │   └── analytics.service.ts
    ├── middleware/
    │   ├── auth.middleware.ts
    │   ├── error.middleware.ts
    │   └── validation.middleware.ts
    ├── validators/
    │   ├── auth.validator.ts
    │   ├── lead.validator.ts
    │   └── campaign.validator.ts
    ├── utils/
    │   ├── jwt.ts
    │   ├── logger.ts
    │   └── pagination.ts
    ├── app.ts
    └── server.ts
```

---

## 🗄 Database Design

1. **`users`**: User account details, password hashes, company profiles, and roles.
2. **`leads`**: Prospect database populated with **5,000+ realistic records** (First/Last name, title, company, email, phone, status: New/Contacted/Qualified/Converted/Unsubscribed, lead score: 1-100).
3. **`campaigns`**: Outbound email campaigns with status toggles (Draft, Active, Paused, Completed) and subject lines.
4. **`campaign_leads`**: Enrolled lead sequence state tracking (Pending, Sent, Opened, Clicked, Replied, Bounced).
5. **`email_sequences`**: Multi-step follow-up steps with delay day triggers and merge variables (`{{first_name}}`, `{{company}}`).
6. **`emails`**: Sent email log history.
7. **`email_events`**: Detailed tracking event stream (open pixel events, link clicks, reply logs).

---

## 🖥 Frontend Pages Included

| Page | Path | Description |
| :--- | :--- | :--- |
| **Login** | `/login` | Secure JWT authentication login form |
| **Register** | `/register` | User workspace registration |
| **Dashboard** | `/dashboard` | KPI stats cards, conversion funnel progress, live activity feed |
| **Leads** | `/leads` | Paginated lead database supporting 5,000+ records with search & status filters |
| **LeadDetails** | `/leads/:id` | Individual prospect profile, lead score editor, campaign history timeline |
| **Campaigns** | `/campaigns` | Campaign list with performance badges, status toggles, and batch send triggers |
| **CreateCampaign** | `/campaigns/create` | Step-by-step 3-stage wizard (Details, Sequence Builder, Lead Picker) |
| **CampaignDetails** | `/campaigns/:id` | Campaign performance breakdown, sequence previews, target leads table |
| **EmailSequences** | `/email-sequences` | Sequence step editor with `{{first_name}}` & `{{company}}` merge tags |
| **Analytics** | `/analytics` | Weekly delivery charts, open/click rate metrics, campaign leaderboard |
| **Settings** | `/settings` | SMTP delivery credentials, custom tracking domain, API key management |
| **Profile** | `/profile` | User account settings and company information |

