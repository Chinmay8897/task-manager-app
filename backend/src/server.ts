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
const PORT = process.env.PORT || 5000;

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

// Simple preflight handling
app.options('*', cors(corsOptions));

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Task Manager API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    corsOrigin: req.headers.origin,
    frontendUrl: process.env.FRONTEND_URL
  });
});

// Error handling middleware
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

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
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
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
