import { Pool, PoolClient, PoolConfig } from 'pg';
import { createUsersTableSQL } from '../models/User';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean | object;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

class Database {
  private pool: Pool;
  private isConnected: boolean = false;

  constructor() {
    const config = this.getConfig();
    this.pool = new Pool(config);
    this.setupEventHandlers();
  }

  private getConfig(): PoolConfig {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // If DATABASE_URL is provided (common in production/Heroku), use it
    if (process.env.DATABASE_URL) {
      return {
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
        max: parseInt(process.env.DB_POOL_MAX || '20'),
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
        connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
      };
    }

    // Otherwise, use individual environment variables
    const config: DatabaseConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'crushed_dev',
      user: process.env.DB_USER || 'crushed',
      password: process.env.DB_PASSWORD || 'dev_password',
      max: parseInt(process.env.DB_POOL_MAX || '20'), // Maximum number of clients in the pool
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'), // Close idle clients after 30 seconds
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'), // Return an error after 2 seconds if connection could not be established
    };

    // Enable SSL in production
    if (isProduction) {
      config.ssl = {
        rejectUnauthorized: false // For self-signed certificates
      };
    }

    return config;
  }

  private setupEventHandlers(): void {
    // Handle pool events
    this.pool.on('connect', (client: PoolClient) => {
      console.log('🔌 New database client connected');
      this.isConnected = true;
    });

    this.pool.on('error', (err: Error) => {
      console.error('❌ Unexpected error on idle client:', err);
      this.isConnected = false;
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('🛑 Received SIGINT. Gracefully shutting down database connections...');
      this.disconnect();
    });

    process.on('SIGTERM', () => {
      console.log('🛑 Received SIGTERM. Gracefully shutting down database connections...');
      this.disconnect();
    });
  }

  /**
   * Test the database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      
      console.log('✅ Database connection successful at:', result.rows[0].now);
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Initialize database tables and setup
   */
  async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing database...');
      
      // Test connection first
      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to database');
      }

      // Create extension for UUID generation
      await this.pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
      console.log('✅ UUID extension created/verified');

      // Create users table
      await this.pool.query(createUsersTableSQL);
      console.log('✅ Users table created/verified');

      // Create additional indexes for performance
      await this.createIndexes();
      console.log('✅ Database indexes created/verified');

      console.log('🎉 Database initialization completed successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create additional database indexes for performance
   */
  private async createIndexes(): Promise<void> {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC)',
      'CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login DESC)',
      'CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email, is_active)',
      'CREATE INDEX IF NOT EXISTS idx_users_username_active ON users(username, is_active)'
    ];

    for (const indexQuery of indexes) {
      await this.pool.query(indexQuery);
    }
  }

  /**
   * Get a database client from the pool
   */
  async getClient(): Promise<PoolClient> {
    try {
      return await this.pool.connect();
    } catch (error) {
      console.error('❌ Failed to get database client:', error);
      throw error;
    }
  }

  /**
   * Execute a query with the pool
   */
  async query(text: string, params?: any[]): Promise<any> {
    try {
      const start = Date.now();
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      // Log slow queries (>100ms)
      if (duration > 100) {
        console.warn(`🐌 Slow query (${duration}ms):`, text.substring(0, 100));
      }
      
      return result;
    } catch (error) {
      console.error('❌ Database query error:', error);
      console.error('Query:', text);
      console.error('Params:', params);
      throw error;
    }
  }

  /**
   * Execute a transaction
   */
  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get the pool instance (for use in other modules)
   */
  getPool(): Pool {
    return this.pool;
  }

  /**
   * Check if database is connected
   */
  isDbConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount
    };
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      console.log('✅ Database connection pool closed');
      this.isConnected = false;
    } catch (error) {
      console.error('❌ Error closing database connection pool:', error);
    }
  }

  /**
   * Health check for monitoring
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    message: string;
    stats?: any;
    timestamp: string;
  }> {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT 1');
      client.release();

      return {
        status: 'healthy',
        message: 'Database connection is working',
        stats: this.getStats(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database connection failed: ${error}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Reset database (WARNING: This will delete all data!)
   * Only use in development/testing
   */
  async reset(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot reset database in production environment');
    }

    try {
      console.log('⚠️  Resetting database...');
      
      // Drop all tables
      await this.pool.query('DROP TABLE IF EXISTS users CASCADE');
      console.log('🗑️  Dropped existing tables');
      
      // Recreate tables
      await this.initialize();
      console.log('✅ Database reset completed');
    } catch (error) {
      console.error('❌ Database reset failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const database = new Database();

// Export the pool for direct use if needed
export const pool = database.getPool();

// Default export
export default database;