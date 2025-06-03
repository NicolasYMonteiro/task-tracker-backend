import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}


export function ensureAuth(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token não fornecido.' });
      return;
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string };
      req.userId = decoded.userId;
      next(); // segue para a rota
    } catch (err) {
      res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
  }
