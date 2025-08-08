import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post('/webhook', async (req, res) => {
  const { type, record } = req.body

  if (type === 'INSERT' && record.table === 'users') {
    const { id, email } = record
    try {
      await prisma.user.create({
        data: {
          id,
          email,
        },
      })
      res.status(200).send('User created')
    } catch (error) {
      console.error(error)
      res.status(500).send('Error creating user')
    }
  } else {
    res.status(200).send('Event received')
  }
})

export default router
