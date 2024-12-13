# Trello Clone

This project is a *Trello clone* built with the [Create T3 App](https://create.t3.gg/). It aims to replicate the functionality and interface of Trello, allowing users to manage tasks in an organized, column-based layout. This application is built with modern web development tools and best practices.

### Key Technologies
- **Programming Language:** TypeScript
- **Framework:** Next.js & React
- **Styling:** TailwindCSS & Shadcn
- **State Management:** React Query & Jotai
- **API:** tRPC
- **Database:** Prisma, Postgres, and Supabase
- **Hosting:** Vercel

## Setup

### 1. Clone the repository
Clone this repository to your local machine:
```bash
git clone <repository-url>
```

### 2. Install dependencies
Install the project dependencies using the following command:
```bash
npm install --legacy-peer-deps
```
**Note:** The `--legacy-peer-deps` flag is required due to compatibility issues with React 19 and some libraries where they have not updated their dependencies yet. You may need to use the same flag if you encounter issues installing new packages (e.g., `npm i <package-name> --legacy-peer-deps`).

### 3. Set up the Postgres database
You need a Postgres database for this app. It can either be:
- A local Postgres database.
- A cloud-hosted database, such as [Supabase](https://supabase.com/) or [Neon](https://neon.tech/).

If you're deploying on Vercel, make sure your database is externally accessible (e.g., hosted on Supabase or Neon).

### 4. Configure environment variables
- Copy the `.env.example` file and rename it to `.env`.
- In the `.env` file, provide the connection URL for your Postgres database under the `DATABASE_URL` variable.

Example:
```bash
DATABASE_URL="postgresql://user:password@hostname:port/database_name"
```

### 5. Set up Prisma schema
Run the following command to push the Prisma schema to your database:
```bash
npx prisma db push
```

### 6. Generate Prisma client
Generate the Prisma client, which allows the app to interact with the database:
```bash
npx prisma generate
```

### 7. Run the project locally
Start the development server:
```bash
npm run dev
```

The app will now be running on http://localhost:3000.

**Note:** This guide does not cover the deployment process, as deployment can vary depending on your chosen platform. If you're deploying on Vercel, refer to their [documentation](https://vercel.com/docs) for deployment steps.

---

## Features

- *Column Management*
  - Add new columns
  - Edit column titles
  - Sort columns
  - Delete columns

- *Task Management*
  - Add tasks to columns
  - Edit task title and description
  - Move tasks between columns
  - Delete tasks

- *UI & Responsiveness*
  - Fully responsive and accessible design
  - Intuitive drag-and-drop task organization
