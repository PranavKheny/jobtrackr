# JobTrackr

JobTrackr is a full-stack web application that helps users organize and track their job applications in one place.

[**Live Demo**](https://jobtrackr.app) | [**Report a Bug**](https://github.com/your-username/job-trackr/issues) | [**Request a Feature**](https://github.com/your-username/job-trackr/issues)

---

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

## Accessibility & UX

- **ARIA Labels**: All interactive elements have appropriate ARIA labels for screen reader support.
- **Keyboard Navigation**: All major flows are fully navigable using only the keyboard.
- **Color Contrast**: The color palette meets WCAG AA standards for readability.
- **Error Handling**: Graceful error handling with a global error boundary and user-friendly toast notifications.
- **Edge Cases**: Empty and no-results states are handled gracefully to provide a better user experience.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [TailwindCSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/), [Prisma](https://www.prisma.io/)
- **Authentication**: [Supabase](https://supabase.io/)
- **Deployment**: [Vercel](https://vercel.com/) (Frontend), [Render](https://render.com/) (Backend & Database)
- **Dev Tools**: [Docker](https://www.docker.com/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [GitHub Actions](https://github.com/features/actions)

## Live Demo

You can try out a live, read-only version of JobTrackr here:

- **URL**: [https://jobtrackr.app](https://jobtrackr.app) (Replace with your deployed URL)
- **Login**: Use the email `demo@example.com` to sign in with a magic link.

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

## Final Quality Checklist

Before launching, it's recommended to perform the following checks in a production-like environment:

- [ ] **Deployment:**
  - [ ] Frontend on Vercel builds and deploys successfully.
  - [ ] Backend on Render builds and deploys successfully.
  - [ ] Database migrations run automatically on backend deployment.
- [ ] **Functionality:**
  - [ ] User can sign up and log in via magic link.
  - [ ] All CRUD operations for jobs (Create, Read, Update, Delete) work as expected.
  - [ ] Dashboard analytics display correct data.
  - [ ] Job list filtering, searching, and sorting work correctly.
  - [ ] CSV export generates a correctly formatted file with all jobs.
- [ ] **Demo Mode:**
  - [ ] Enable demo mode and verify that the banner is displayed.
  - [ ] Confirm that all write operations are disabled in demo mode.
- [ ] **Responsiveness:**
  - [ ] Test the application on various screen sizes (mobile, tablet, desktop) to ensure the layout is consistent and usable.
- [ ] **Cross-Browser Testing:**
  - [ ] Test the application in major browsers (Chrome, Firefox, Safari) to ensure compatibility.

## Future Roadmap

- **AI-Powered Suggestions**: Integrate AI to provide suggestions for resume keywords or cover letter improvements based on job descriptions.
- **Calendar Integration**: Allow users to sync interview dates with their Google or Outlook calendars.
- **Multi-user/Teams**: Introduce a team-based version for recruiters or career coaches.
- **File Uploads**: Allow users to upload and attach resumes, cover letters, and other documents to each job application.
- **Advanced Analytics**: More detailed analytics, such as time-to-offer, interview success rate, and more.

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
