# Trello Clone

This project is a _Trello clone_ built with the [Create T3 App](https://create.t3.gg/). It aims to replicate the functionality and interface of Trello, allowing users to manage tasks in an organized, column-based layout. This application is built with modern web development tools and best practices.

## Key Technologies

- **Programming Language:** TypeScript
- **Framework:** Next.js & React
- **Styling:** TailwindCSS & Shadcn
- **State Management:** React Query & Jotai
- **API:** tRPC
- **Database:** Prisma, Postgres, and Supabase
- **Hosting:** Vercel
- **Testing:** Vitest

## Bonus Tasks

1. Authentication and Authorization: Users can register and log in using a username and password. Passwords are securely hashed using SHA256 with a salt to enhance security. Each user can only access their own board, ensuring data privacy and segregation.

2. Unit Testing: Several unit tests have been implemented to validate the application's functionality. The vitest library is used for testing, and a Continuous Integration (CI) process has been set up to automatically execute tests whenever a pull request is made to the main branch.

3. Logging: Error messages are formatted using built-in error handling utilities, making it easier for the frontend to display meaningful messages to the user via an easy to use API. Additionally, internal server errors are logged in the database using tRPC’s `onError` method for efficient error tracking.

4. Responsive and Accessible Frontend: The frontend is designed to be both responsive and accessible. The Shadcn component library with Radix for accessibility is used to address various accessibility concerns. TailwindCSS is used to build a responsive design that adapts seamlessly to desktop, tablet, and mobile devices. For drag-and-drop functionality, the [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) library, which supports both mouse and touchscreen devices.

5. CI/CD Pipeline: A robust CI/CD pipeline has been configured using GitHub Actions and Vercel. As mentioned in point 2, tests are automatically run upon a pull request to the main branch. Additionally, GitHub has been configured to prevent direct pushes to the main branch. Once a push to the main branch is detected, Vercel automatically deploys the latest version of the application.

6. Docker Configuration: A Docker configuration is available as an alternative deployment method. The `docker-compose.yml` file defines two services: one for the application and one for the database. The configuration also supports live code reloading during development, making it easier to test changes in real-time. For more details, refer to the [Docker section](#docker).

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

## Docker

This repository also includes a Docker configuration as an alternative setup method. The `docker-compose.yml` file defines two services: one for hosting the PostgreSQL database and another for running the app.

If you choose to run the application with Docker, you'll need to provide the environment variables `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` for the PostgreSQL service.

To launch the services with hot reloading, use the following command:

```bash
docker compose up --watch
```

---

## Features

- _Column Management_

  - Add new columns
  - Edit column titles
  - Sort columns
  - Delete columns

- _Task Management_

  - Add tasks to columns
  - Edit task title and description
  - Move tasks between columns
  - Delete tasks

- _Authentication_

  - Register and login with username and password
  - Each user gets to keep their own board

- _UI & Responsiveness_
  - Fully responsive and accessible design
  - Intuitive drag-and-drop task organization
