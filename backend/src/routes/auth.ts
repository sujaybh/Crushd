import { Router } from 'express';
import { Pool } from 'pg';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { validateLogin, validatePasswordReset, validateRegistration } from '../middleware/validation';

export function createAuthRoutes(pool: Pool): Router {
  const router = Router();
  const authController = new AuthController(pool);

  /**
   * @route   POST /api/auth/register
   * @desc    Register a new user
   * @access  Public
   * @body    { email, username, password, first_name?, last_name?, date_of_birth? }
   */
  router.post('/register', validateRegistration, authController.register);

  /**
   * @route   POST /api/auth/login
   * @desc    Authenticate user and get tokens
   * @access  Public
   * @body    { email, password }
   */
  router.post('/login', validateLogin, authController.login);

  /**
   * @route   POST /api/auth/refresh
   * @desc    Refresh access token using refresh token
   * @access  Public (requires refresh token in cookies)
   */
  router.post('/refresh', authController.refreshToken);

  /**
   * @route   POST /api/auth/logout
   * @desc    Logout user and clear refresh token
   * @access  Public
   */
  router.post('/logout', authController.logout);

  /**
   * @route   GET /api/auth/me
   * @desc    Get current user information
   * @access  Private
   * @headers Authorization: Bearer <access_token>
   */
  router.get('/me', authMiddleware, authController.me);

  /**
   * @route   GET /api/auth/validate
   * @desc    Validate current access token
   * @access  Private
   * @headers Authorization: Bearer <access_token>
   */
  router.get('/validate', authMiddleware, authController.validateToken);

  /**
   * @route   POST /api/auth/forgot-password
   * @desc    Request password reset email
   * @access  Public
   * @body    { email }
   */
  router.post('/forgot-password', validatePasswordReset, authController.requestPasswordReset);

  /**
   * @route   POST /api/auth/reset-password
   * @desc    Reset password using reset token
   * @access  Public
   * @body    { token, newPassword }
   */
  router.post('/reset-password', authController.resetPassword);

  return router;
}

// Alternative export for direct import
export default createAuthRoutes;