import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
dotenv.config({ path: '../.env' });


import { swaggerSpec } from "@/config/swagger";
import swaggerUi from "swagger-ui-express";
import database from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createAuthRoutes } from './routes/auth.js';



console.log('=== DOTENV DEBUG ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('Current working directory:', process.cwd());
console.log('===================');


// Swagger UI
const app = express();
const server = createServer(app);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8081'],
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8081'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbHealth = await database.healthCheck();
  const dbStats = database.getStats();
  
  res.status(dbHealth.status === 'healthy' ? 200 : 503).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbHealth,
    pool: dbStats,
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', createAuthRoutes(database.getPool()));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: '🎮 Welcome to Crushd API!',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*'
    }
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('🚀 Starting Crushd Backend Server...');
    
    // Initialize database
    console.log('🔄 Initializing database...');
    await database.initialize();
    
    // Start server
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API available at: http://localhost:${PORT}/api-docs`);
      console.log(`💾 Database: ${database.isDbConnected() ? '✅ Connected' : '❌ Disconnected'}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...');
  await database.disconnect();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
  await database.disconnect();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

startServer();