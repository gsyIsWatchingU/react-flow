import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@react-flow/shared-types';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);
  
  const response: ApiResponse = {
    success: false,
    message: error.message || 'Internal server error',
    data: null
  };
  
  res.status(500).json(response);
};
