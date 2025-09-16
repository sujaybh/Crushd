import dotenv from 'dotenv';
dotenv.config();

import database from '../config/database.js';


//dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function initDatabase() {
  try {
    console.log('🚀 Initializing Crushd Database...\n');
    
    // Test connection
    const isConnected = await database.testConnection();
    if (!isConnected) {
      console.error('❌ Cannot connect to database');
      process.exit(1);
    }
    
    // Initialize database (creates tables, indexes, etc.)
    await database.initialize();
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('✅ Ready to accept connections');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await database.disconnect();
  }
}

initDatabase();