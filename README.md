# 📌 Issue Tracker – Form & Table

A simple issue tracking module built with **Next.js**, **Prisma ORM**, and **NextAuth.js**, allowing users to view and create issues in a clean interface.

## 🚀 Features
- **User Authentication** with NextAuth.js (Credentials Provider)
- **Issue Table** to list all issues from the database
- **Issue Form** to add new issues
- Backend API routes to handle create and fetch operations
- **Prisma ORM** for database interaction with PostgreSQL
- Secure password handling with bcrypt
- Responsive UI built with Tailwind CSS

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router), React Hook Form, Zod
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js (Credentials)
- **UI:** Tailwind CSS + ShadCN UI

## ⚙️ Setup
```bash
# Clone repository
git clone https://github.com/yourusername/issue-tracker.git
cd issue-tracker

# Install dependencies
npm install

# Create .env file
DATABASE_URL="your_postgres_url"
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
