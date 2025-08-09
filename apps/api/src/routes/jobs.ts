// apps/api/src/routes/jobs.ts
import { Router, type Request, type Response } from 'express';
import prisma from '../prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Protect all job routes
router.use(requireAuth);

const isDemoMode = process.env.DEMO_MODE === 'true';

// GET /api/jobs — list jobs with filters/search/sort/pagination
router.get('/', async (req: Request, res: Response) => {
  const userId = (req as any).user.id as string;

  const {
    status,
    q,
    sort = 'createdAt',
    order = 'desc',
    page = '1',
    pageSize = '10',
  } = req.query;

  const pageNumber = Math.max(parseInt(String(page), 10) || 1, 1);
  const size = Math.min(Math.max(parseInt(String(pageSize), 10) || 10, 1), 100);

  const where: Record<string, unknown> = { userId };

  if (status) {
    const statuses = String(status).split(',').map((s) => s.trim());
    where.status = { in: statuses };
  }

  if (q) {
    const query = String(q);
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { company: { contains: query, mode: 'insensitive' } },
      { location: { contains: query, mode: 'insensitive' } },
      { notes: { contains: query, mode: 'insensitive' } },
    ];
  }

  const jobs = await prisma.job.findMany({
    where,
    orderBy: {
      [String(sort)]: String(order).toLowerCase() === 'asc' ? 'asc' : 'desc',
    },
    skip: (pageNumber - 1) * size,
    take: size,
  });

  const total = await prisma.job.count({ where });

  res.json({ data: jobs, total, page: pageNumber, pageSize: size });
});

// POST /api/jobs — create a new job
router.post('/', async (req: Request, res: Response) => {
  if (isDemoMode) {
    return res.status(403).json({ message: 'Writes are disabled in demo mode.' });
  }

  const userId = (req as any).user.id as string;
  const { title, company, location, status, notes, appliedAt, jobLink } = req.body;

  const job = await prisma.job.create({
    data: {
      title,
      company,
      location,
      status,
      notes,
      jobLink: jobLink ?? null,
      appliedAt: appliedAt ? new Date(appliedAt) : new Date(),
      userId,
    },
  });

  res.status(201).json({ data: job });
});

// PUT /api/jobs/:id — update a job (scoped to owner)
router.put('/:id', async (req: Request, res: Response) => {
  if (isDemoMode) {
    return res.status(403).json({ message: 'Writes are disabled in demo mode.' });
  }

  const userId = (req as any).user.id as string;
  const idNum = Number(req.params.id);
  if (!Number.isFinite(idNum)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }

  const { title, company, location, status, notes, appliedAt, jobLink } = req.body;

  const result = await prisma.job.updateMany({
    where: { id: idNum, userId },
    data: {
      title,
      company,
      location,
      status,
      notes,
      jobLink: jobLink ?? null,
      appliedAt: appliedAt ? new Date(appliedAt) : undefined,
    },
  });

  if (result.count === 0) {
    return res.status(404).json({ message: 'Job not found' });
  }

  const job = await prisma.job.findUnique({ where: { id: idNum } });
  res.json({ data: job });
});

// DELETE /api/jobs/:id — delete a job (scoped to owner)
router.delete('/:id', async (req: Request, res: Response) => {
  if (isDemoMode) {
    return res.status(403).json({ message: 'Writes are disabled in demo mode.' });
  }

  const userId = (req as any).user.id as string;
  const idNum = Number(req.params.id);
  if (!Number.isFinite(idNum)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }

  const result = await prisma.job.deleteMany({
    where: { id: idNum, userId },
  });

  if (result.count === 0) {
    return res.status(404).json({ message: 'Job not found' });
  }

  res.status(204).end();
});

// GET /api/jobs/stats — aggregate stats
router.get('/stats', async (req: Request, res: Response) => {
  const userId = (req as any).user.id as string;

  const stats = await prisma.job.groupBy({
    by: ['status'],
    where: { userId },
    _count: { status: true },
  });

  const totalJobs = await prisma.job.count({ where: { userId } });
  const offerCount = stats.find((s) => s.status === 'OFFER')?._count.status ?? 0;
  const offerRate = totalJobs > 0 ? (offerCount / totalJobs) * 100 : 0;

  res.json({ stats, totalJobs, offerRate });
});

export default router;
