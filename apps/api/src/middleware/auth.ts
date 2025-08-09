import type { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { Buffer } from 'node:buffer';

function decodeJwt(token: string): any | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = (req.header('authorization') || req.header('Authorization')) ?? '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing bearer token' });
    }

    const token = auth.slice('Bearer '.length).trim();
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const claims = decodeJwt(token);
    const userId = claims?.sub as string | undefined;
    const email =
      (claims?.email || claims?.user_metadata?.email || 'unknown@example.com') as string;

    if (!userId) return res.status(401).json({ error: 'Invalid token (no sub)' });

    // Ensure the user exists (FK safety for Job.userId)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email },
    });

    (req as any).user = { id: userId, email };
    next();
  } catch (err) {
    console.error('requireAuth error', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
