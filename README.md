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
```
## 📸 Screenshots
<img width="1916" height="925" alt="issue-tracker-simple-4" src="https://github.com/user-attachments/assets/502c11e8-7026-4228-a120-cdd9e3a1c48d" />
<img width="1912" height="926" alt="issue-tracker-simple-3" src="https://github.com/user-attachments/assets/6820b06b-5f9f-47f5-9057-adf0028e684e" />
<img width="1911" height="922" alt="issue-tracker-simple-1" src="https://github.com/user-attachments/assets/1720ad3d-a785-4fab-828a-f3d28ec2502b" />
<img width="1912" height="926" alt="issue-tracker-simple-2" src="https://github.com/user-attachments/assets/4e57b742-1d4b-4dd6-917b-cab61f615d13" />

