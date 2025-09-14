# Study Plans App

A modern, full-stack study plans management application built with Next.js 15, featuring an admin panel for creating and managing educational courses, and a user interface for browsing and subscribing to study plans.

## 🚀 Live Demo

**Production URL**: [study-plans-app-ycl8.vercel.app](https://study-plans-app-ycl8.vercel.app)

## Features

- 📚 **Study Plans Management**: Create, edit, and delete study plans with modules and lessons
- 🎯 **Admin Panel**: Secure admin interface for managing all study plans
- 👤 **User Dashboard**: Personal dashboard to track progress and subscriptions
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 🔐 **Authentication**: Admin token-based authentication for secure operations
- 📱 **Responsive Design**: Mobile-first responsive design
- ⚡ **Performance**: Built with Next.js 15 and Turbopack for optimal performance

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Build Tool**: Turbopack

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun package manager

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd study-plans-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```bash
   touch .env.local
   ```
   
   Add the following environment variables:
   ```env
   ADMIN_TOKEN=your-secure-admin-token-here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
   In the current deployment, to serve our purpose, the token is: admin123

   ```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application locally, or visit the [live demo](https://study-plans-app-ycl8.vercel.app) to see the deployed version.

## Usage

### Public Pages

- **Home** (`/`): Landing page with featured study plans
- **Study Plans** (`/plans`): Browse all available study plans
- **Plan Details** (`/plans/[slug]`): View detailed information about a specific study plan
- **User Dashboard** (`/me`): Personal dashboard for tracking progress

### Admin Panel

- **Admin Dashboard** (`/admin`): Access the admin panel for managing study plans
- **Authentication**: Use your `ADMIN_TOKEN` to authenticate admin operations
- **Plan Management**: Create, edit, and delete study plans
- **Module Management**: Add modules and lessons to study plans

### API Endpoints

- `GET /api/plans` - Fetch all public study plans
- `GET /api/plans/[slug]` - Fetch a specific study plan by slug
- `GET /api/admin/plans` - Fetch all plans (admin only)
- `POST /api/admin/plans` - Create a new study plan (admin only)
- `PUT /api/admin/plans/[id]` - Update a study plan (admin only)
- `DELETE /api/admin/plans/[id]` - Delete a study plan (admin only)
- `GET /api/me` - Get user profile and subscriptions
- `POST /api/subscribe` - Subscribe to a study plan
- `POST /api/progress` - Update learning progress

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── me/                # User dashboard
│   ├── plans/             # Study plans pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── PlanCard.tsx      # Study plan card component
│   ├── PlanForm.tsx      # Plan creation/editing form
│   ├── PlansTable.tsx    # Admin plans table
│   └── SubscribeButton.tsx # Subscription component
└── lib/                   # Utility functions
    └── utils.ts          # Common utilities
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks
