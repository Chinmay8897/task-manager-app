import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDatabase } from './utils/database';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://task-manager-app-ruddy-zeta.vercel.app',
      'https://task-manager-app.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    console.log(`🔍 CORS Check - Origin: ${origin}, Allowed: ${allowedOrigins.join(', ')}`);

    if (!origin || allowedOrigins.includes(origin)) {
      console.log('✅ CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin blocked');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin,Cache-Control,Pragma');
    res.header('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Basic health check (no database required)
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running!',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Task Manager API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    corsOrigin: req.headers.origin,
    frontendUrl: process.env.FRONTEND_URL
  });
});// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server Error:', err.message);

  if (err.message === 'Not allowed by CORS') {
    console.error(`❌ CORS Error - Origin: ${req.headers.origin}, Frontend URL: ${process.env.FRONTEND_URL}`);
    return res.status(403).json({
      message: 'CORS policy violation',
      origin: req.headers.origin,
      allowedOrigins: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://task-manager-app-ruddy-zeta.vercel.app',
        'https://task-manager-app.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean)
    });
  }

  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server with comprehensive error handling
const startServer = async () => {
  try {
    console.log('🔄 Starting server initialization...');
    console.log('🔧 Environment variables check:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
    console.log(`   PORT: ${process.env.PORT || 'undefined'}`);
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? 'Set ✅' : 'Not set ❌'}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? 'Set ✅' : 'Not set ❌'}`);
    console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'undefined'}`);

    // Validate required environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    console.log('🔌 Connecting to database...');
    await connectDatabase();
    console.log('✅ Database connected successfully');

    console.log('🚀 Starting HTTP server...');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`✅ Allowed CORS origins:`);
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://task-manager-app-ruddy-zeta.vercel.app',
        'https://task-manager-app.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean);
      allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
      console.log('✅ Server startup completed successfully!');
    });

    // Error handling for server
    server.on('error', (error: any) => {
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      }
      process.exit(1);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`🛑 ${signal} received, shutting down gracefully`);
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    console.error('❌ Exiting process with code 1');
    process.exit(1);
  }
};startServer();
