# WB Merch 🛍️

WB Merch is a comprehensive e-commerce platform built with Next.js, featuring a robust admin dashboard, user authentication, product management, and integrated payment processing.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5 (Auth.js)](https://authjs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Storage**: [AWS S3](https://aws.amazon.com/s3/) & [CloudFront](https://aws.amazon.com/cloudfront/)
- **Payments**: [Flutterwave](https://flutterwave.com/)
- **Emails**: [Resend](https://resend.com/) & [React Email](https://react.email/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Slider**: [Swiper](https://swiperjs.com/)

## ✨ Features

- **User Authentication**: Email/password and Social login (Google, Facebook).
- **Product Management**: Categorized products, search, and detailed views.
- **Shopping Cart & Wishlist**: Persistent cart and wishlist for users.
- **Checkout & Payments**: Integrated Flutterwave for secure payments.
- **Admin Dashboard**: Manage products, orders, users, and view sales analytics.
- **Address Management**: Users can manage multiple shipping addresses.
- **Order Tracking**: Detailed order history and status updates.
- **Responsive Design**: Fully optimized for mobile and desktop.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18.17 or later recommended)
- npm, yarn, pnpm, or bun
- MongoDB account (for database)
- AWS account (for S3 and CloudFront)
- Flutterwave account (for payments)
- Resend account (for emails)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd wb-merch
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:

   ```bash
   # Database
   DATABASE_URL="your_mongodb_connection_string"

   # AWS (Storage)
   BUCKET_NAME="your_bucket_name"
   BUCKET_REGION="your_bucket_region"
   ACCESS_KEY="your_aws_access_key"
   SECRET_ACCESS_KEY="your_aws_secret_access_key"
   CLOUD_FRONT_URL="your_cloudfront_url"
   DUSTRIBUTION_ID="your_cloudfront_distribution_id"

   # Authentication (NextAuth v5)
   NEXTAUTH_URL="http://localhost:3000"
   AUTH_SECRET="your_nextauth_secret"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   FACEBOOK_CLIENT_ID="your_facebook_client_id"
   FACEBOOK_CLIENT_SECRET="your_facebook_client_secret"

   # Payments (Flutterwave)
   FLW_PUBLIC_KEY="your_flutterwave_public_key"
   FLW_SECRET_KEY="your_flutterwave_secret_key"
   FLW_WEBHOOK_SECRET_HASH="your_webhook_secret_hash"

   # Email (Resend)
   RESEND_API_KEY="your_resend_api_key"
   RESEND_AUDIENCE_ID="your_resend_audience_id"

   # App Configuration
   Next_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize Prisma**:
   ```bash
   npx prisma generate
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run prod`: Combined build and start command (`next build && next start`).
- `npm run lint`: Runs ESLint to check for code issues.
- `npm run postinstall`: Automatically runs `prisma generate` after installation.

## 📁 Project Structure

```text
├── actions/         # Server Actions for data mutations
├── app/             # Next.js App Router
│   ├── (main)/      # User-facing routes (shop, account, auth)
│   ├── admin/       # Admin dashboard routes
│   └── api/         # API routes (including webhooks)
├── components/      # Reusable UI components
├── context/         # React Context providers
├── data/            # Data access layer (direct Prisma queries)
├── emails/          # Email templates (React Email)
├── hooks/           # Custom React hooks
├── lib/             # Shared library configurations (Prisma, S3, etc.)
├── prisma/          # Prisma schema
├── public/          # Static assets (images, icons)
├── schemas/         # Zod validation schemas
├── store.ts         # Redux store configuration
└── utils/           # Helper functions and utilities
```

## 🏗️ Webhook Setup

Flutterwave webhooks are used to handle payment confirmations and update order status. For a detailed guide on how to set this up, refer to [WEBHOOK_SETUP.md](WEBHOOK_SETUP.md).



## 🚀 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
