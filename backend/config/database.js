const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    // Get MongoDB URI from environment or use default
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 MongoDB URI:', MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Hide password in logs
    
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 Mongoose connection closed due to app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('1. Make sure MongoDB is running: mongod');
    console.log('2. Check your .env file exists in backend folder');
    console.log('3. Verify MONGODB_URI is set correctly');
    console.log('4. For local MongoDB: mongodb://localhost:27017/ecommerce');
    console.log('5. For MongoDB Atlas: Get connection string from cloud.mongodb.com');
    console.log('');
    process.exit(1);
  }
};

module.exports = connectDatabase;