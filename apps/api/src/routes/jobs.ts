import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { protect } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

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
  const { id } = req.params
  await prisma.job.delete({
    where: { id: Number(id) },
  })
  res.json({ message: 'Job deleted' })
})

export default router
