import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { CreateUserData, UserModel, UserResponse } from '../models/User';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string; // ISO date string
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserResponse;
  tokens: AuthTokens;
}

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

export class AuthService {
  private userModel: UserModel;
  private jwtSecret: string;
  private refreshSecret: string;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;

  constructor(pool: Pool) {
    this.userModel = new UserModel(pool);
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const { email, username, password, first_name, last_name, date_of_birth } = registerData;

    // Validate email format
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    if (!this.isValidPassword(password)) {
      throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    // Check if email already exists
    const emailExists = await this.userModel.emailExists(email);
    if (emailExists) {
      throw new Error('Email already registered');
    }

    // Check if username already exists
    const usernameExists = await this.userModel.usernameExists(username);
    if (usernameExists) {
      throw new Error('Username already taken');
    }

    // Validate username format
    if (!this.isValidUsername(username)) {
      throw new Error('Username must be 3-30 characters long and can only contain letters, numbers, and underscores');
    }

    // Create user data object
    const userData: CreateUserData = {
      email: email.toLowerCase().trim(),
      username: username.trim(),
      password,
      first_name: first_name?.trim(),
      last_name: last_name?.trim(),
      date_of_birth: date_of_birth ? new Date(date_of_birth) : undefined
    };

    // Create user
    const user = await this.userModel.createUser(userData);

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user,
      tokens
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await this.userModel.findByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.userModel.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await this.userModel.updateLastLogin(user.id);

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Return user without password
    const userResponse = UserModel.excludePassword(user);

    return {
      user: userResponse,
      tokens
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = jwt.verify(refreshToken, this.refreshSecret) as JWTPayload;

      // Find user to ensure they still exist and are active
      const user = await this.userModel.findById(payload.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      return this.generateTokens(user);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async verifyAccessToken(token: string): Promise<JWTPayload> {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as JWTPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  async getUserById(userId: string): Promise<UserResponse | null> {
    return await this.userModel.findById(userId);
  }

  private generateTokens(user: UserResponse): AuthTokens {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      username: user.username
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.accessTokenExpiry
    });

    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshTokenExpiry
    });

    return {
      accessToken,
      refreshToken
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  private isValidUsername(username: string): boolean {
    // 3-30 characters, letters, numbers, and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
  }

  // Method to validate age (18+ for dating app)
  static isValidAge(dateOfBirth: Date): boolean {
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      return age - 1 >= 18;
    }
    
    return age >= 18;
  }
}