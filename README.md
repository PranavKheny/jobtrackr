# JobTrackr

JobTrackr is a full-stack web application that helps users organize and track their job applications in one place.

![Screenshot of JobTrackr Dashboard](https://via.placeholder.com/1200x600.png?text=JobTrackr+Dashboard+Screenshot)

## Features

- **Authentication**: Secure email-based login with magic links via Supabase.
- **Job Management**: Full CRUD functionality for job applications.
- **Analytics**: Dashboard with a visual summary of job application activity.
- **CSV Export**: Export all job applications to a CSV file.
- **Advanced Filtering & Sorting**: Filter jobs by status, search by keyword, and sort by various criteria.
- **Pagination**: Paginated job list for better performance.
- **Optimistic UI**: Smooth user experience with optimistic updates for job operations.
- **Demo Mode**: A read-only demo mode to showcase the application.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [TailwindCSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/), [Prisma](https://www.prisma.io/)
- **Authentication**: [Supabase](https://supabase.io/)
- **Deployment**: [Vercel](https://vercel.com/) (Frontend), [Render](https://render.com/) (Backend & Database)
- **Dev Tools**: [Docker](https://www.docker.com/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [GitHub Actions](https://github.com/features/actions)

## Local Development

To run JobTrackr locally, you will need Node.js, npm, and Docker installed.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/job-trackr.git
    cd job-trackr
    ```

2.  **Set up Environment Variables**
    - Copy the `.env.example` file to `.env` and fill in the required values. See the "Environment Variables" section for details.
    ```bash
    cp .env.example .env
    ```

3.  **Install Dependencies**
    ```bash
    npm install
    ```

4.  **Run the Development Servers with Docker**
    - This is the recommended way to run the application locally.
    ```bash
    docker-compose up -d
    ```
    The services will be available at:
    - Frontend: `http://localhost:3000`
    - Backend: `http://localhost:3001`
    - Database: `localhost:5432`

5.  **Run Manually (without Docker)**
    - You will need to have PostgreSQL running on your machine.
    - Run the backend API: `npm run api:dev`
    - Run the frontend web app: `npm run dev`

## Power User Features

The dashboard supports several URL query parameters to filter, sort, and paginate the job list:
- `status`: Filter by one or more statuses (comma-separated). Example: `?status=APPLIED,INTERVIEWING`
- `q`: Search for a term across job titles, companies, locations, and notes.
- `sort`: Sort by `createdAt`, `appliedAt`, `status`, or `company`.
- `order`: `asc` or `desc`.
- `page`: The page number to display.
- `pageSize`: The number of items per page.

## Seeding the Database

You can seed the database with sample data using the following command:
```bash
npm run seed
```
This is useful for development and for populating a new database for the demo mode.

## Demo Mode

JobTrackr supports a read-only demo mode. To enable it, set the following environment variables:
- `DEMO_MODE=true`
- `NEXT_PUBLIC_DEMO_MODE=true`

In demo mode, all write operations (creating, updating, deleting jobs) are disabled, and a banner is displayed at the top of the page.

## Deployment

### Frontend (Vercel)

1.  Fork this repository.
2.  Go to [Vercel](https://vercel.com/new) and connect your new repository.
3.  Vercel will automatically detect that this is a Next.js application and configure the build settings.
4.  Add the required environment variables in the Vercel project settings.

### Backend & Database (Render)

1.  Fork this repository.
2.  Go to [Render](https://render.com/) and create a new "Blueprint" service.
3.  Connect your repository. Render will use the `render.yaml` file to configure the services.
4.  Add the required environment variables in the Render service settings.

## Environment Variables

| Variable                       | Description                                                                                              | Example                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`     | The URL of your Supabase project.                                                                        | `https://your-project-id.supabase.co`                                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| The anonymous key for your Supabase project.                                                             | `ey...`                                                                  |
| `DATABASE_URL`                 | The connection string for your PostgreSQL database.                                                      | `postgresql://user:pass@host:port/db`                                    |
| `NEXT_PUBLIC_API_BASE_URL`     | The base URL for the backend API.                                                                        | `http://localhost:3001`                                                  |
| `WEB_APP_URL`                  | The URL of the deployed web application. Used for CORS.                                                  | `http://localhost:3000`                                                  |
| `DEMO_MODE`                    | Enables/disables read-only demo mode for the backend.                                                    | `false`                                                                  |
| `NEXT_PUBLIC_DEMO_MODE`        | Enables/disables the demo mode banner on the frontend.                                                   | `false`                                                                  |

## Troubleshooting

- **Dependency Installation Issues**: This project has been developed in an environment where `npm install` sometimes fails. If you encounter issues, ensure you are using a stable version of Node.js (e.g., 18.x) and npm.
- **CORS Errors**: If you are running the frontend and backend on different domains, ensure the `WEB_APP_URL` environment variable is set correctly on the backend.
- **Prisma Errors**: If you encounter errors related to the Prisma client, try running `npx prisma generate` in the `apps/api` directory.
