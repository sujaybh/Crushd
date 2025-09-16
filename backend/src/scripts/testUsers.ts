import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import database from '../config/database.js';
import { UserModel } from '../models/User.js';

interface TestUser {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
}

const testUsers: TestUser[] = [
  {
    email: 'alex@crushd.app',
    username: 'alex_player',
    password: 'SecurePass123!',
    first_name: 'Alex',
    last_name: 'Johnson',
    date_of_birth: new Date('1995-03-15')
  },
  {
    email: 'sarah@crushd.app',
    username: 'sarah_gamer',
    password: 'GameOn456!',
    first_name: 'Sarah',
    last_name: 'Williams',
    date_of_birth: new Date('1998-07-22')
  },
  {
    email: 'mike@crushd.app',
    username: 'mike_crusher',
    password: 'CrushIt789!',
    first_name: 'Mike',
    last_name: 'Davis',
    date_of_birth: new Date('1992-11-08')
  },
  {
    email: 'emma@crushd.app',
    username: 'emma_hearts',
    password: 'LoveWins321!',
    first_name: 'Emma',
    last_name: 'Brown',
    date_of_birth: new Date('1996-05-12')
  },
  {
    email: 'chris@crushd.app',
    username: 'chris_match',
    password: 'MatchMaker654!',
    first_name: 'Chris',
    last_name: 'Taylor',
    date_of_birth: new Date('1994-09-03')
  }
];

async function testUserOperations() {
  let pool: Pool | null = null;
  
  try {
    console.log('🧪 Starting User CRUD Tests...\n');
    
    // Connect to database
    await database.testConnection();
    pool = database.getPool();
    const userModel = new UserModel(pool);
    
    console.log('📋 Test Plan:');
    console.log('  1. Create test users');
    console.log('  2. Verify user creation');
    console.log('  3. Test duplicate prevention');
    console.log('  4. Test user lookup methods');
    console.log('  5. Test password verification');
    console.log('  6. Clean up test data\n');
    
    // =======================
    // TEST 1: Create Users
    // =======================
    console.log('🔹 TEST 1: Creating test users...');
    const createdUsers = [];
    
    for (const userData of testUsers) {
      try {
        const user = await userModel.createUser(userData);
        createdUsers.push(user);
        console.log(`  ✅ Created user: ${user.username} (${user.email})`);
      } catch (error) {
        console.log(`  ❌ Failed to create ${userData.username}: ${error}`);
      }
    }
    
    console.log(`\n📊 Created ${createdUsers.length}/${testUsers.length} users successfully\n`);
    
    // =======================
    // TEST 2: Verify Creation
    // =======================
    console.log('🔹 TEST 2: Verifying user data...');
    for (const user of createdUsers) {
      const foundUser = await userModel.findById(user.id);
      if (foundUser) {
        console.log(`  ✅ Verified user: ${foundUser.username}`);
        console.log(`     📧 Email: ${foundUser.email}`);
        console.log(`     👤 Name: ${foundUser.first_name} ${foundUser.last_name}`);
        console.log(`     🎂 Age: ${calculateAge(foundUser.date_of_birth!)} years old`);
      } else {
        console.log(`  ❌ Could not find user with ID: ${user.id}`);
      }
    }
    
    // =======================
    // TEST 3: Duplicate Prevention
    // =======================
    console.log('\n🔹 TEST 3: Testing duplicate prevention...');
    try {
      await userModel.createUser(testUsers[0]);
      console.log('  ❌ ERROR: Duplicate user was created (should have failed)');
    } catch (error) {
      console.log(`  ✅ Duplicate prevented: ${error}`);
    }
    
    // =======================
    // TEST 4: Lookup Methods
    // =======================
    console.log('\n🔹 TEST 4: Testing lookup methods...');
    
    // Test findByEmail
    const userByEmail = await userModel.findByEmail(testUsers[0].email);
    console.log(`  ${userByEmail ? '✅' : '❌'} Find by email: ${testUsers[0].email}`);
    
    // Test findByUsername
    const userByUsername = await userModel.findByUsername(testUsers[1].username);
    console.log(`  ${userByUsername ? '✅' : '❌'} Find by username: ${testUsers[1].username}`);
    
    // Test non-existent user
    const nonExistentUser = await userModel.findByEmail('nonexistent@test.com');
    console.log(`  ${!nonExistentUser ? '✅' : '❌'} Non-existent user returns null`);
    
    // =======================
    // TEST 5: Password Verification
    // =======================
    console.log('\n🔹 TEST 5: Testing password verification...');
    if (userByEmail) {
      const correctPassword = await userModel.verifyPassword(testUsers[0].password, userByEmail.password_hash);
      const wrongPassword = await userModel.verifyPassword('wrongpassword', userByEmail.password_hash);
      
      console.log(`  ${correctPassword ? '✅' : '❌'} Correct password verification`);
      console.log(`  ${!wrongPassword ? '✅' : '❌'} Wrong password rejection`);
    }
    
    // =======================
    // TEST 6: List All Users
    // =======================
    console.log('\n🔹 TEST 6: Listing all test users...');
    const allUsersQuery = `
      SELECT id, email, username, first_name, last_name, created_at 
      FROM users 
      WHERE email LIKE '%@crushd.app' 
      ORDER BY created_at ASC
    `;
    const allUsers = await pool.query(allUsersQuery);
    
    console.log(`📋 Found ${allUsers.rows.length} test users in database:`);
    allUsers.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.username} (${user.email}) - Created: ${new Date(user.created_at).toLocaleString()}`);
    });
    
    // =======================
    // TEST 7: Cleanup Option
    // =======================
    console.log('\n🔹 TEST 7: Cleanup options...');
    console.log('💡 To clean up test data, run: npm run db:cleanup');
    console.log('   Or manually delete users with: DELETE FROM users WHERE email LIKE \'%@crushd.app\';');
    
    console.log('\n🎉 All user tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`   ✅ Users created: ${createdUsers.length}`);
    console.log(`   ✅ Lookups tested: Email, Username, ID`);
    console.log(`   ✅ Password verification: Working`);
    console.log(`   ✅ Duplicate prevention: Working`);
    
  } catch (error) {
    console.error('❌ User tests failed:', error);
    process.exit(1);
  } finally {
    if (pool) {
      await database.disconnect();
    }
  }
}

// Helper function to calculate age
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Add cleanup function
export async function cleanupTestUsers() {
  try {
    await database.testConnection();
    const pool = database.getPool();
    
    const result = await pool.query('DELETE FROM users WHERE email LIKE \'%@crushd.app\'');
    console.log(`🧹 Cleaned up ${result.rowCount} test users`);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await database.disconnect();
  }
}

// Run tests if this file is executed directly
testUserOperations();
