# Fund-Wave Client

Fund-Wave is a modern crowdfunding platform where users can create campaigns, support fundraising projects, make secure payments, and manage their campaigns from a responsive web interface.

## 🚀 Live Website

[Fund-Wave Live](https://frontend-hro3.vercel.app)

## 📌 Project Overview

Fund-Wave is designed to make crowdfunding simple and accessible. Users can explore fundraising campaigns, create their own campaigns, donate to causes, and manage their activities through an intuitive dashboard.

The client-side application provides a responsive and user-friendly interface with authentication, campaign management, payment integration, and dashboard functionality.

## ✨ Features

* 🔐 User Authentication
* 👤 User Profile Management
* 📢 Create and Manage Campaigns
* 🔎 Browse and Search Campaigns
* 💰 Donation and Payment System
* 💳 Stripe Payment Integration
* 📊 User Dashboard
* 📈 Campaign Progress Tracking
* 🧾 Payment History
* 📱 Fully Responsive Design
* ⚡ Fast and Modern UI
* 🔒 Protected Routes
* 🎨 Modern Component-Based Interface

## 🛠️ Technologies Used

### Frontend

* Next.js
* React.js
* TypeScript
* Tailwind CSS
* HeroUI
* JavaScript
* Axios

### Backend & Database

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication & Payment

* Better Auth
* Stripe

### Deployment

* Vercel

## 📂 Project Structure

```text
Fund-Wave-Client/
├── public/
│   ├── images/
│   └── ...
│
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── services/
│   └── ...
│
├── .env.local
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/MDSOBUJMADBOR/Fund-Wave-Client.git
```

Go to the project directory:

```bash
cd Fund-Wave-Client
```

Install dependencies:

```bash
npm install
```

## 🔑 Environment Variables

Create a `.env.local` file in the root directory and add the required environment variables:

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

> Never commit sensitive API keys or secret credentials to GitHub.

## ▶️ Run the Project

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## 🏗️ Build for Production

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 💳 Payment System

Fund-Wave uses **Stripe** to process secure online payments.

The payment flow includes:

1. User selects a donation/package.
2. Client sends payment information to the backend.
3. Backend creates a Stripe Checkout Session.
4. User completes payment securely through Stripe.
5. Stripe sends payment confirmation through the backend.
6. Payment information is stored in the database.

## 🔐 Authentication

The application uses authentication to provide secure access to protected features.

Authenticated users can:

* Create campaigns
* Manage their campaigns
* Make payments
* View payment history
* Access their dashboard
* Manage their profile

## 📱 Responsive Design

The application is designed to work across:

* 📱 Mobile devices
* 📱 Tablets
* 💻 Laptops
* 🖥️ Desktop screens

## 🌐 Deployment

The frontend is deployed using Vercel.

**Live URL:**

https://frontend-hro3.vercel.app

## 🔗 Related Repository

### Backend

Fund-Wave Server:

```text
https://github.com/MDSOBUJMADBOR/Fund-Wave-Server
```

### Backend Deployment

```text
https://backend-one-chi-49.vercel.app
```

## 👨‍💻 Developer

**MD. SOBUJ MADBOR**

Junior Full Stack Developer | MERN Stack Developer

### Skills

* React.js
* Next.js
* TypeScript
* Node.js
* Express.js
* MongoDB
* Tailwind CSS
* REST API
* Stripe Integration

## 📄 License

This project is developed for educational and portfolio purposes.

---

⭐ If you like this project, consider giving it a star on GitHub.

