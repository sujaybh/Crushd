import dotenv from 'dotenv';
dotenv.config();

import { cleanupTestUsers } from './testUsers.js';

async function cleanup() {
  console.log('🧹 Starting cleanup...\n');
  
  try {
    await cleanupTestUsers();
    console.log('\n✅ Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();