import dotenv from 'dotenv';
dotenv.config();

import database from '../config/database.js';

// Sample user data for seeding
const sampleUsers = [
  {
    email: 'alex.johnson@example.com',
    username: 'alexj',
    password: 'hashedpassword123', // In real app, this would be bcrypt hashed
    firstName: 'Alex',
    lastName: 'Johnson',
    dateOfBirth: '1995-03-15',
    location: 'San Francisco, CA',
    bio: 'Love hiking, coffee, and good conversations. Looking for genuine connections!',
    interests: ['hiking', 'coffee', 'photography', 'travel'],
    isActive: true,
    isVerified: true
  },
  {
    email: 'maria.garcia@example.com',
    username: 'mariag',
    password: 'hashedpassword456',
    firstName: 'Maria',
    lastName: 'Garcia',
    dateOfBirth: '1993-07-22',
    location: 'Austin, TX',
    bio: 'Artist and yoga instructor. Passionate about sustainability and mindful living.',
    interests: ['yoga', 'art', 'sustainability', 'cooking'],
    isActive: true,
    isVerified: true
  },
  {
    email: 'david.chen@example.com',
    username: 'davidc',
    password: 'hashedpassword789',
    firstName: 'David',
    lastName: 'Chen',
    dateOfBirth: '1992-11-08',
    location: 'Seattle, WA',
    bio: 'Software engineer by day, musician by night. Always up for trying new restaurants!',
    interests: ['music', 'technology', 'food', 'gaming'],
    isActive: true,
    isVerified: false
  },
  {
    email: 'sarah.wilson@example.com',
    username: 'sarahw',
    password: 'hashedpassword101',
    firstName: 'Sarah',
    lastName: 'Wilson',
    dateOfBirth: '1996-01-30',
    location: 'Denver, CO',
    bio: 'Outdoor enthusiast and dog lover. Let\'s explore the mountains together!',
    interests: ['hiking', 'skiing', 'dogs', 'photography'],
    isActive: true,
    isVerified: true
  },
  {
    email: 'jordan.taylor@example.com',
    username: 'jordant',
    password: 'hashedpassword202',
    firstName: 'Jordan',
    lastName: 'Taylor',
    dateOfBirth: '1994-09-12',
    location: 'Portland, OR',
    bio: 'Book lover and coffee connoisseur. Looking for someone to share adventures with.',
    interests: ['reading', 'coffee', 'travel', 'movies'],
    isActive: true,
    isVerified: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding Crushd Database...\n');
    
    // Test connection
    const isConnected = await database.testConnection();
    if (!isConnected) {
      console.error('❌ Cannot connect to database');
      process.exit(1);
    }
    
    // Check if users already exist
    const existingUsersResult = await database.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(existingUsersResult.rows[0].count);
    
    if (userCount > 0) {
      console.log(`⚠️  Database already contains ${userCount} users.`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise<string>((resolve) => {
        readline.question('Do you want to clear existing data and reseed? (y/N): ', resolve);
      });
      
      readline.close();
      
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('❌ Seeding cancelled');
        return;
      }
      
      // Clear existing data
      console.log('🗑️  Clearing existing data...');
      await database.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
      console.log('✅ Existing data cleared');
    }
    
    // Insert sample users
    console.log('👥 Inserting sample users...');
    
    for (let i = 0; i < sampleUsers.length; i++) {
      const user = sampleUsers[i];
      
      const insertUserQuery = `
        INSERT INTO users (
          email, username, password_hash, first_name, last_name, 
          date_of_birth, location, bio, interests, 
          is_active, is_verified, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
        ) RETURNING id, username
      `;
      
      const values = [
        user.email,
        user.username,
        user.password, // In real app, hash with bcrypt first
        user.firstName,
        user.lastName,
        user.dateOfBirth,
        user.location,
        user.bio,
        JSON.stringify(user.interests),
        user.isActive,
        user.isVerified
      ];
      
      const result = await database.query(insertUserQuery, values);
      console.log(`✅ Created user: ${result.rows[0].username} (ID: ${result.rows[0].id})`);
    }
    
    // Display summary
    const finalCountResult = await database.query('SELECT COUNT(*) FROM users');
    const finalCount = parseInt(finalCountResult.rows[0].count);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Total users in database: ${finalCount}`);
    console.log('✅ Ready for development and testing');
    
    // Show some sample data
    console.log('\n👀 Sample users created:');
    const sampleResult = await database.query(`
      SELECT username, first_name, last_name, location, is_verified, email
      FROM users 
      ORDER BY created_at 
      LIMIT 5
    `);
    
    sampleResult.rows.forEach((user: any, index: number) => {
      console.log(`  ${index + 1}. ${user.username} (${user.first_name} ${user.last_name}) - ${user.location} ${user.is_verified ? '✓' : '○'}`);
      console.log(`     Email: ${user.email}`);
    });
    
    console.log('\n🔑 All users have password: "password123", "password456", etc.');
    console.log('💡 Use any of the above emails to test login functionality!');
    
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await database.disconnect();
  }
}

// Allow running with optional flags
const args = process.argv.slice(2);
const forceReset = args.includes('--force') || args.includes('-f');

if (forceReset) {
  console.log('🔄 Force reset flag detected, will clear existing data without prompting');
}

seedDatabase();