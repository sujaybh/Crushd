import { NextFunction, Request, Response } from 'express';
import { Pool } from 'pg';
import { AuthService, LoginCredentials, RegisterData } from '../services/authService';

export class AuthController {
  private authService: AuthService;

  constructor(pool: Pool) {
    this.authService = new AuthService(pool);
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const registerData: RegisterData = req.body;

      // Validate required fields
      const { email, username, password } = registerData;
      if (!email || !username || !password) {
        res.status(400).json({
          success: false,
          message: 'Email, username, and password are required'
        });
        return;
      }

      // Validate age if date_of_birth is provided
      if (registerData.date_of_birth) {
        const birthDate = new Date(registerData.date_of_birth);
        if (!AuthService.isValidAge(birthDate)) {
          res.status(400).json({
            success: false,
            message: 'You must be at least 18 years old to use Crushd'
          });
          return;
        }
      }

      const result = await this.authService.register(registerData);

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const credentials: LoginCredentials = req.body;

      // Validate required fields
      const { email, password } = credentials;
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      const result = await this.authService.login(credentials);

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: 'Refresh token not provided'
        });
        return;
      }

      const tokens = await this.authService.refreshToken(refreshToken);

      // Set new refresh token as HTTP-only cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: tokens.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // User information should be available from auth middleware
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const user = await this.authService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User information retrieved successfully',
        data: {
          user
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Validate token endpoint (useful for frontend to check token validity)
  validateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // If we reach here, the auth middleware has already validated the token
      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: {
          user: (req as any).user
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Password reset initiation (placeholder for future implementation)
  requestPasswordReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required'
        });
        return;
      }

      // TODO: Implement email sending for password reset
      // For now, just return success to prevent email enumeration
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    } catch (error) {
      next(error);
    }
  };

  // Password reset completion (placeholder for future implementation)
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Reset token and new password are required'
        });
        return;
      }

      // TODO: Implement password reset logic
      res.status(501).json({
        success: false,
        message: 'Password reset functionality not yet implemented'
      });
    } catch (error) {
      next(error);
    }
  };
}