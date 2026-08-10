import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For demo/prototype seamlessly allow anonymous session
    req.user = { id: 'demo-user-123', email: 'user@equora.ai', username: 'TraderGuest' };
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'equora_jwt_secret_super_key_2026';
    const decoded = jwt.verify(token, secret) as any;
    req.user = decoded;
    next();
  } catch (err) {
    req.user = { id: 'demo-user-123', email: 'user@equora.ai', username: 'TraderGuest' };
    next();
  }
};
