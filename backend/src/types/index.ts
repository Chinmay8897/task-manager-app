import { Request } from 'express';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface TaskQuery extends PaginationQuery {
  status?: 'pending' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  search?: string;
  dueDate?: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  completionRate: number;
  priorityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface DatabaseConfig {
  uri: string;
  options: {
    maxPoolSize: number;
    serverSelectionTimeoutMS: number;
    socketTimeoutMS: number;
    family: number;
  };
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface ServerConfig {
  port: number;
  env: 'development' | 'production' | 'test';
  corsOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMax: number;
}
