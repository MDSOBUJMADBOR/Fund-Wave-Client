# 🌊 FundWave — Next-Gen Crowdfunding Platform (Client)

<div align="center">

![FundWave Banner](https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop)

**Empowering Visionaries, One Wave at a Time.**

[![Live Site](https://img.shields.io/badge/Live%20Demo-frontend--hro3.vercel.app-7928CA?style=for-the-badge&logo=vercel&logoColor=white)](https://frontend-hro3.vercel.app)
[![API Server](https://img.shields.io/badge/API%20Server-backend--one--chi--49.vercel.app-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://backend-one-chi-49.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.11-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📌 Project Overview

**FundWave** is a full-featured, credit-powered crowdfunding web application engineered to bridge the gap between creative innovators and generous backers. Built with a modern Next.js App Router architecture and Tailwind CSS, the platform provides seamless role-based workflows for **Supporters**, **Creators**, and **Administrators**.

Backers purchase platform credits (1 Credit = $1.00 USD) via Stripe to pledge toward verified initiatives with safe escrow guarantees. Creators launch campaigns, review backer pledges, and request milestone withdrawals directly to their accounts.

---

## 🌐 Live Deployments

- **Frontend Client Application**: [https://frontend-hro3.vercel.app](https://frontend-hro3.vercel.app)
- **Backend API Service**: [https://backend-one-chi-49.vercel.app](https://backend-one-chi-49.vercel.app)

---

## ✨ Key Features

### 🔔 1. Real-Time Notification System
- Interactive notification bell on both public and dashboard navigation bars with live badge counter.
- Floating pop-up card displaying notifications sorted descending by timestamp (`time: -1`).
- Outside-click dismissal handler (`document.addEventListener("mousedown")`).
- Automated notification triggers for:
  - Contribution approved/rejected by Creator to Supporter.
  - New contribution created by Supporter to Creator.
  - Campaign approved/rejected by Admin to Creator.
  - Withdrawal request approved by Admin to Creator.
- One-click navigation to the relevant `actionRoute` and instant clearance controls.

### 🔍 2. Explore Campaigns Search & Multi-Filter Engine
- Instant multi-field text search across Campaign Title, Creator Name, Story, and Category.
- Filter chips by category (**Technology**, **Education**, **Health**, **Community**, **Art**, **Environment**).
- Deadline & status selector (*Active Only*, *Urgent ≤ 7 Days Left*).
- Funding goal ranges (*Under $1K*, *$1K–$5K*, *$5K+*).
- Dynamic sorting (*Most Raised*, *Highest Progress %*, *Newest*, *Ending Soonest*, *Goal High/Low*).
- One-click "Reset All Filters" state.

### 🤖 3. Persistent 24/7 AI Chat Assistant
- Always-visible floating AI assistant widget at the bottom-right corner across all pages.
- Integrated with backend `/api/chat` using OpenAI (`gpt-4o-mini`) and smart FundWave knowledge-base fallback.
- Contextual quick-suggestion chips (*How credits work?*, *How to launch a campaign?*, *Refund protection?*, *Withdrawals?*).
- Auto-opens when navigating to `/aichat`.

### 👥 4. Role-Based Dashboards
- **Supporter Dashboard**:
  - Live statistics (total contributions, pending pledges, total amount contributed).
  - Stripe credit checkout integration (50, 100, 250, 500 credit packages).
  - Pledges and contribution status history with transparent refund statuses.
- **Creator Dashboard**:
  - Stats counter (total campaigns, active projects, total raised credits).
  - Review contributions table with modal preview and Approve / Reject (refund) buttons.
  - Campaign creation wizard with image upload and funding milestones.
  - Payout & withdrawal request manager.
- **Admin Dashboard**:
  - Platform metrics (total supporters, creators, system-wide credits, processed payouts).
  - Campaign approval / rejection queue.
  - Creator withdrawal request verification and payment clearance.
  - User management table with role assignment (Supporter / Creator / Admin).
  - Moderation & fraud reports resolution desk.

### 🎨 5. Premium UI & Dedicated Pages
- **Hero Slider Section**: Swiper-powered 3-banner carousel with video playback on demand.
- **How It Works**: Interactive role-based stepper (Supporter vs. Creator) and credit economics guide.
- **About Page**: Platform mission, core values, and evolution roadmap.
- **Contact Page**: Interactive contact form with in-card success states and direct channels.
- **User Profile**: Live credits counter, activity stats, and real-time profile editor modal.
- **Custom 404 & Loading**: Animated error handling and hydration loaders.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS Tokens |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Carousel / Slider** | [Swiper](https://swiperjs.com/) |
| **Auth Client** | Better Auth Client |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📂 Project Directory Structure

```text
frontend/
├── public/                  # Static assets & videos
│   ├── videos/              # Video banners (video-1.mp4, etc.)
│   └── fund-wave.png        # Brand assets
├── src/
│   ├── app/                 # Next.js App Router routes
│   │   ├── about/           # About Us page
│   │   ├── aichat/          # Dedicated AI Assistant page
│   │   ├── campaigns/[id]/  # Dynamic Campaign Details page
│   │   ├── contact/         # Contact & Support page
│   │   ├── dashboard/       # Role-protected Dashboards
│   │   │   ├── Admin/       # Admin control center
│   │   │   ├── Creator/     # Creator management center
│   │   │   └── Supporter/   # Supporter pledge & credits center
│   │   ├── explorecampaigns/# Search & filter campaign directory
│   │   ├── howitworks/      # Platform mechanics & FAQ guide
│   │   ├── login/           # User authentication
│   │   ├── register/        # Account registration
│   │   ├── profile/         # User profile & credentials manager
│   │   ├── loading.tsx      # Branded suspense loading component
│   │   ├── not-found.tsx    # Custom 404 Not Found error page
│   │   └── layout.tsx       # Root layout (Navbar, Footer, Global AIChatBox)
│   ├── components/          # Reusable UI components
│   │   ├── AIChatBox.tsx    # Global floating AI assistant widget
│   │   ├── NotificationBell.tsx # Pop-up notification system
│   │   ├── HeroSection.tsx  # Swiper video slider banner
│   │   ├── Navbar.tsx       # Public responsive header
│   │   ├── DashboardNavbar.tsx # Authenticated topbar
│   │   ├── DashboardSidebar.tsx # Role-aware dashboard sidebar
│   │   └── Footer.tsx       # Global footer
│   └── lib/                 # Auth client and shared utilities
├── .env.example             # Template for environment variables
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+
- **npm** or **pnpm** or **yarn**

### 2. Clone the Repository
```bash
git clone https://github.com/MDSOBUJMADBOR/Fund-Wave-Client.git
cd Fund-Wave-Client
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Backend API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000

# Image Hosting & Storage
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key_here

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 5. Run the Local Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with Turbopack |
| `npm run build` | Compiles optimized production bundle |
| `npm run start` | Runs production server locally |
| `npm run lint` | Executes ESLint validation checks |

---

## 🔒 Security & Best Practices
- **Role-Based Access Control (RBAC)**: Only authorized roles access designated dashboard routes.
- **Client Sanitization**: All user inputs, search queries, and URLs are validated.
- **Secure Escrow**: Credits are held in platform custody until creator milestone acceptance.

---

## 📄 License
This project is licensed under the [ISC License](LICENSE).
