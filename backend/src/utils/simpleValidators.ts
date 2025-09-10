import { Request, Response, NextFunction } from 'express';

// Simple validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50;
};

// Simple validation middleware
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  const errors: any[] = [];

  if (!name || !validateName(name)) {
    errors.push({ field: 'name', message: 'Name must be between 2 and 50 characters' });
  }

  if (!email || !validateEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (!password || !validatePassword(password)) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const errors: any[] = [];

  if (!email || !validateEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export const validateTask = (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body;
  const errors: any[] = [];

  if (!title || title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Task title is required' });
  }

  if (title && title.length > 200) {
    errors.push({ field: 'title', message: 'Task title must be less than 200 characters' });
  }

  if (description && description.length > 1000) {
    errors.push({ field: 'description', message: 'Task description must be less than 1000 characters' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;

  if (!objectIdRegex.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  next();
};
