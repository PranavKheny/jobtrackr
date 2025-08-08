import { PrismaClient, JobStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      id: 'auth0|demo-user-id', // Replace with a realistic demo user ID
      email: 'demo@example.com',
    },
  })

  const jobs = [
    {
      title: 'Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      status: JobStatus.INTERVIEWING,
    },
    {
      title: 'Product Manager',
      company: 'Facebook',
      location: 'Menlo Park, CA',
      status: JobStatus.APPLIED,
    },
    {
      title: 'Data Scientist',
      company: 'Amazon',
      location: 'Seattle, WA',
      status: JobStatus.REJECTED,
    },
    {
      title: 'UX Designer',
      company: 'Apple',
      location: 'Cupertino, CA',
      status: JobStatus.OFFER,
    },
    {
      title: 'Frontend Developer',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      status: JobStatus.APPLIED,
    },
    {
      title: 'Backend Developer',
      company: 'Microsoft',
      location: 'Redmond, WA',
      status: JobStatus.INTERVIEWING,
    },
    {
      title: 'DevOps Engineer',
      company: 'Twitter',
      location: 'San Francisco, CA',
      status: JobStatus.APPLIED,
    },
    {
      title: 'QA Engineer',
      company: 'Uber',
      location: 'San Francisco, CA',
      status: JobStatus.REJECTED,
    },
    {
      title: 'Data Analyst',
      company: 'LinkedIn',
      location: 'Sunnyvale, CA',
      status: JobStatus.APPLIED,
    },
    {
      title: 'Full Stack Developer',
      company: 'Salesforce',
      location: 'San Francisco, CA',
      status: JobStatus.INTERVIEWING,
    },
  ]

  for (const job of jobs) {
    await prisma.job.create({
      data: {
        ...job,
        userId: demoUser.id,
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
