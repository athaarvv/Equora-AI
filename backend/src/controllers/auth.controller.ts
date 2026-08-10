import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const secret = process.env.JWT_SECRET || 'equora_jwt_secret_super_key_2026';
  
  const token = jwt.sign({ id: `user-${Date.now()}`, email, username }, secret, { expiresIn: '7d' });

  res.status(201).json({
    user: { id: `user-${Date.now()}`, username: username || 'Investor', email },
    token
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const secret = process.env.JWT_SECRET || 'equora_jwt_secret_super_key_2026';
  
  const username = email ? email.split('@')[0] : 'TraderGuest';
  const token = jwt.sign({ id: 'demo-user-123', email, username }, secret, { expiresIn: '7d' });

  res.json({
    user: { id: 'demo-user-123', username, email },
    token
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  res.json({
    user: { id: 'demo-user-123', username: 'TraderGuest', email: 'trader@equora.ai' }
  });
};
