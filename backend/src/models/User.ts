import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: Date;
  profile_picture_url?: string;
  bio?: string;
  location?: string;
  is_verified: boolean;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: Date;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: Date;
  profile_picture_url?: string;
  bio?: string;
  location?: string;
  is_verified: boolean;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createUser(userData: CreateUserData): Promise<UserResponse> {
    const { email, username, password, first_name, last_name, date_of_birth } = userData;
    
    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (
        email, username, password_hash, first_name, last_name, date_of_birth,
        is_verified, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id, email, username, first_name, last_name, date_of_birth,
                profile_picture_url, bio, location, is_verified, is_active,
                last_login, created_at, updated_at
    `;

    const values = [
      email,
      username,
      password_hash,
      first_name || null,
      last_name || null,
      date_of_birth || null,
      false, // is_verified
      true   // is_active
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE username = $1 AND is_active = true';
    const result = await this.pool.query(query, [username]);
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<UserResponse | null> {
    const query = `
      SELECT id, email, username, first_name, last_name, date_of_birth,
             profile_picture_url, bio, location, is_verified, is_active,
             last_login, created_at, updated_at
      FROM users 
      WHERE id = $1 AND is_active = true
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async updateLastLogin(userId: string): Promise<void> {
    const query = 'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1';
    await this.pool.query(query, [userId]);
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async emailExists(email: string): Promise<boolean> {
    const query = 'SELECT 1 FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows.length > 0;
  }

  async usernameExists(username: string): Promise<boolean> {
    const query = 'SELECT 1 FROM users WHERE username = $1';
    const result = await this.pool.query(query, [username]);
    return result.rows.length > 0;
  }

  // Helper method to exclude password from user object
  static excludePassword(user: User): UserResponse {
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

// SQL to create the users table
export const createUsersTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    profile_picture_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
`;