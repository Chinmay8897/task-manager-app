import jwt from 'jsonwebtoken';

export class JWTUtil {
  private static secret: string = process.env.JWT_SECRET || 'fallback-secret-key';

  static generateToken(payload: { userId: string; email: string }): string {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' });
  }

  static generateRefreshToken(payload: { userId: string }): string {
    return jwt.sign(payload, this.secret, { expiresIn: '30d' });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      } else if (error?.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  static verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error: any) {
      throw new Error('Invalid refresh token');
    }
  }

  static decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error: any) {
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }
}
