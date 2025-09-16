import { Router } from 'express';
import { Pool } from 'pg';
import { AuthController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateLogin, validatePasswordReset, validateRegistration } from '../middleware/validation.js';

export function createAuthRoutes(pool: Pool): Router {
  const router = Router();
  const authController = new AuthController(pool);

  /**
   * @openapi
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, username, password]
   *             properties:
   *               email:
   *                 type: string
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       201:
   *         description: User registered successfully
   */
  router.post('/register', validateRegistration, authController.register);

  /**
   * @openapi
   * /api/auth/login:
   *   post:
   *     summary: Login user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   */
  router.post('/login', validateLogin, authController.login);

  /**
   * @openapi
   * /api/auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   */
  router.post('/refresh', authController.refreshToken);

  /**
   * @openapi
   * /api/auth/logout:
   *   post:
   *     summary: Logout user
   *     responses:
   *       200:
   *         description: Logout successful
   */
  router.post('/logout', authController.logout);

  /**
   * @openapi
   * /api/auth/me:
   *   get:
   *     summary: Get current user info
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User information retrieved
   */
  router.get('/me', authMiddleware, authController.me);

  /**
   * @openapi
   * /api/auth/validate:
   *   get:
   *     summary: Validate access token
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Token is valid
   */
  router.get('/validate', authMiddleware, authController.validateToken);

  /**
   * @openapi
   * /api/auth/forgot-password:
   *   post:
   *     summary: Request password reset
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email]
   *             properties:
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: Password reset email sent
   */
  router.post('/forgot-password', validatePasswordReset, authController.requestPasswordReset);

  /**
   * @openapi
   * /api/auth/reset-password:
   *   post:
   *     summary: Reset password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [token, newPassword]
   *             properties:
   *               token:
   *                 type: string
   *               newPassword:
   *                 type: string
   *     responses:
   *       200:
   *         description: Password reset successful
   */
  router.post('/reset-password', authController.resetPassword);

  return router;
}

// Alternative export for direct import
export default createAuthRoutes;