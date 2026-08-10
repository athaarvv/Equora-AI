import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[EQUORA ERROR]:', err);
  
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    error: true,
    message: message,
    fallbackMessage: "I couldn't complete the financial query request right now. I don't want to guess. Please try again."
  });
};
