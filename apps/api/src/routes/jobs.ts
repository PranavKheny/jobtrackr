import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { protect } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

const isDemoMode = process.env.DEMO_MODE === 'true'

// Get all jobs for the current user
router.get('/', protect, async (req, res) => {
  // @ts-ignore
  const userId = req.user.id
  const jobs = await prisma.job.findMany({
    where: { userId },
  })
  res.json(jobs)
})

// Add a new job
router.post('/', protect, async (req, res) => {
  if (isDemoMode) {
    return res.status(403).json({ message: 'Writes are disabled in demo mode.' })
  }
  // @ts-ignore
  const userId = req.user.id
  const { title, company, location, status, notes } = req.body
  const job = await prisma.job.create({
    data: {
      title,
      company,
      location,
      status,
      notes,
      userId,
    },
  })
  res.json(job)
})

// Update a job
router.put('/:id', protect, async (req, res) => {
  if (isDemoMode) {
    return res.status(403).json({ message: 'Writes are disabled in demo mode.' })
  }
  const { id } = req.params
  const { title, company, location, status, notes } = req.body
  const job = await prisma.job.update({
    where: { id: Number(id) },
    data: {
      title,
      company,
      location,
      status,
      notes,
    },
  })
  res.json(job)
})

// Delete a job
router.delete('/:id', protect, async (req, res) => {
  if (isDemoMode) {
    return res.status(403).json({ message: 'Writes are disabled in demo mode.' })
  }
  const { id } = req.params
  await prisma.job.delete({
    where: { id: Number(id) },
  })
  res.json({ message: 'Job deleted' })
})

// Get job stats
router.get('/stats', protect, async (req, res) => {
  // @ts-ignore
  const userId = req.user.id

  const stats = await prisma.job.groupBy({
    by: ['status'],
    where: { userId },
    _count: {
      status: true,
    },
  })

  const totalJobs = await prisma.job.count({
    where: { userId },
  })

  const offerCount =
    stats.find((s) => s.status === 'OFFER')?._count.status || 0
  const offerRate = totalJobs > 0 ? (offerCount / totalJobs) * 100 : 0

  res.json({
    stats,
    totalJobs,
    offerRate,
  })
})

export default router
