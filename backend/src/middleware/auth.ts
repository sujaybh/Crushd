import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../services/authService';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT tokens
 * Expects Authorization header with Bearer token format
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    // Check if token starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format. Use Bearer <token>'
      });
      return;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Add user info to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Token has expired.',
        code: 'TOKEN_EXPIRED'
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.',
        code: 'INVALID_TOKEN'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token is provided
 * Useful for endpoints that work with or without authentication
 */
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without user
    next();
    return;
  }

  const token = authHeader.substring(7);
  
  if (!token) {
    next();
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    req.user = decoded;
  } catch (error) {
    // Token is invalid, but we continue without user
    // You could also log this for monitoring purposes
  }

  next();
};

/**
 * Middleware to check if user has specific roles (for future use)
 * Usage: requireRole('admin', 'moderator')
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      });
      return;
    }

    // Note: Role checking would require extending the User model to include roles
    // For now, this is a placeholder for future implementation
    res.status(501).json({
      success: false,
      message: 'Role-based access control not yet implemented.'
    });
  };
};

/**
 * Middleware to check if the authenticated user is accessing their own resources
 * Compares req.user.userId with req.params.userId
 */
export const requireOwnership = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Authentication required.'
    });
    return;
  }

  const userIdFromParams = req.params.userId || req.params.id;
  
  if (req.user.userId !== userIdFromParams) {
    res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
    return;
  }

  next();
};

/**
 * Middleware to extract user ID from token and add it to params
 * Useful for routes where you want to use the authenticated user's ID
 */
export const injectUserId = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user) {
    req.params.userId = req.user.userId;
  }
  next();
};