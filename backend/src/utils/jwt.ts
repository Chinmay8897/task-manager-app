import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '../types';

export class JWTUtil {
  private static secret = process.env.JWT_SECRET || 'fallback-secret-key';
  private static expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  private static refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

  static generateToken(payload: { userId: string; email: string }): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
      issuer: 'task-manager-app',
      audience: 'task-manager-users'
    });
  }

  static generateRefreshToken(payload: { userId: string }): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.refreshExpiresIn,
      issuer: 'task-manager-app',
      audience: 'task-manager-refresh'
    });
  }

  static verifyToken(token: string): AuthTokenPayload {
    try {
      return jwt.verify(token, this.secret, {
        issuer: 'task-manager-app',
        audience: 'task-manager-users'
      }) as AuthTokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  static verifyRefreshToken(token: string): { userId: string } {
    try {
      return jwt.verify(token, this.secret, {
        issuer: 'task-manager-app',
        audience: 'task-manager-refresh'
      }) as { userId: string };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static decodeToken(token: string): AuthTokenPayload | null {
    try {
      return jwt.decode(token) as AuthTokenPayload;
    } catch (error) {
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  static getTokenExpirationDate(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    return new Date(decoded.exp * 1000);
  }
}
