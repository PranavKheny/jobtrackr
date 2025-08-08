# JobTrackr

JobTrackr is a full-stack web application that helps users organize and track their job applications in one place.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [TailwindCSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/), [Prisma](https://www.prisma.io/)
- **Authentication**: [Supabase](https://supabase.io/)
- **Dev Tools**: [Docker](https://www.docker.com/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/job-trackr.git
    ```
2.  **Set up Supabase**
    - Create a new project on [Supabase](https://supabase.io/).
    - Go to the "Authentication" section and enable the Email provider.
    - Go to the "Database" section and get your database connection string.
    - Go to the "API" section and get your project URL and anon key.

3.  **Set up environment variables**
    - Copy the `.env.example` file to `.env` and fill in the required values for the database and Supabase.
    ```bash
    cp .env.example .env
    ```
4.  **Install dependencies**
    ```bash
    npm install
    ```
5.  **Run the database migrations**
    ```bash
    npx prisma migrate dev
    ```
6.  **Run the development servers**
    ```bash
    docker-compose up -d
    ```
    This will start the following services:
    - `web`: Next.js frontend running on `http://localhost:3000`
    - `api`: Express backend running on `http://localhost:3001`
    - `db`: PostgreSQL database running on `http://localhost:5432`

## API Endpoints

All job-related endpoints are protected and require a valid Supabase JWT.

- `GET /api/jobs`: Fetch all jobs for the current user.
- `POST /api/jobs`: Add a new job.
- `PUT /api/jobs/:id`: Update a job.
- `DELETE /api/jobs/:id`: Delete a job.

## Available Scripts

- `npm run dev`: Starts the web app in development mode.
- `npm run build`: Builds the web app for production.
- `npm run start`: Starts the web app in production mode.
- `npm run lint`: Lints the web app.
- `npm run api:dev`: Starts the api in development mode.

## Folder Structure

- `apps/web`: The Next.js frontend application.
- `apps/api`: The Express backend application.
- `packages/ui`: Shared UI components.
- `prisma`: Prisma schema and migrations.
