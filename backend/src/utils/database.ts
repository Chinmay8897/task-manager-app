import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('🔗 Attempting to connect to MongoDB...');
    console.log(`🔗 MongoDB URI: ${mongoURI.substring(0, 20)}...`);

    // Configure mongoose options for better production reliability
    mongoose.set('strictQuery', false);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });

    console.log('📊 MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
    }
    throw error; // Re-throw to let the caller handle it
  }
};
