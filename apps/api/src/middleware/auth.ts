import { supabase } from '../lib/supabase'
import { Request, Response, NextFunction } from 'express'

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const { data, error } = await supabase.auth.getUser(token)

  if (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // @ts-ignore
  req.user = data.user
  next()
}
