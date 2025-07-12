import { Request, Response, NextFunction } from 'express';

export class HttpException extends Error {
  public status: number;
  public message: string;
  public details?: any; // For additional error details, like validation errors

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details;
    // Object.setPrototypeOf(this, HttpException.prototype); // For ES6 classes extending Error
  }
}

// Global error handling middleware - to be registered in src/index.ts
export const globalErrorHandler = (
  err: Error | HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction, // Must be present for Express to recognize it as an error handler
): void => {
  if (err instanceof HttpException) {
    res.status(err.status).json({
      status: 'error',
      statusCode: err.status,
      message: err.message,
      details: err.details,
    });
  } else {
    // Log the error for debugging (using a proper logger is recommended)
    console.error('Unhandled Error:', err);

    // Generic error for unhandled exceptions
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
      // details: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Only show stack in dev
    });
  }
};
