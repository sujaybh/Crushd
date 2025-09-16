import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import database from '../config/database.js';

interface ClearOptions {
  force?: boolean;
  verbose?: boolean;
}

/**
 * Nuclear option - drops all tables and recreates the database schema
 */
async function clearDatabase(options: ClearOptions = {}): Promise<void> {
  let pool: Pool | null = null;
  
  try {
    console.log('🧨 Database Clear Utility - NUCLEAR OPTION\n');
    
    // Connect to database
    await database.testConnection();
    pool = database.getPool();
    
    // Get current table count
    const tableCountQuery = `
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `;
    const tableResult = await pool.query(tableCountQuery);
    const tableCount = parseInt(tableResult.rows[0].count);
    
    if (options.verbose) {
      console.log(`📊 Found ${tableCount} tables to drop`);
    }
    
    // Safety check
    if (!options.force && tableCount > 0) {
      console.log('⚠️  WARNING: This will DROP ALL TABLES and DATA!');
      console.log('   This is a NUCLEAR option - everything will be gone.');
      console.log('   Use { force: true } to proceed.\n');
      console.log('❌ Clear cancelled. Set force: true to proceed.');
      return;
    }
    
    if (tableCount === 0) {
      console.log('✅ Database is already empty. Nothing to clear.');
      return;
    }
    
    console.log('🚀 Starting nuclear database clear...\n');
    const startTime = Date.now();
    
    // Method 1: Drop all tables individually (most thorough)
    await dropAllTables(pool, options.verbose);
    
    // Method 2: Drop and recreate public schema (alternative approach)
    // await recreateSchema(pool, options.verbose);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    // Verify everything is gone
    const finalResult = await pool.query(tableCountQuery);
    const remainingTables = parseInt(finalResult.rows[0].count);
    
    console.log('\n🎉 Database clear completed!');
    console.log(`   Time taken: ${duration.toFixed(2)} seconds`);
    console.log(`   Tables dropped: ${tableCount}`);
    console.log(`   Remaining tables: ${remainingTables}`);
    
    if (remainingTables > 0) {
      console.log('\n⚠️  Some tables still exist - this shouldn\'t happen!');
    } else {
      console.log('\n💥 Database successfully nuked! Everything is gone.');
    }
    
  } catch (error) {
    console.error('❌ Database clear failed:', error);
    throw error;
  } finally {
    if (pool) {
      await database.disconnect();
    }
  }
}

/**
 * Drop all tables individually
 */
async function dropAllTables(pool: Pool, verbose: boolean = false): Promise<void> {
  // Get all tables
  const tablesQuery = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;
  
  const result = await pool.query(tablesQuery);
  const tables = result.rows.map(row => row.table_name);
  
  if (verbose) {
    console.log(`🗑️  Dropping ${tables.length} tables...`);
  }
  
  // Drop all tables with CASCADE to handle dependencies
  for (const table of tables) {
    try {
      await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
      if (verbose) {
        console.log(`  ✅ Dropped table: ${table}`);
      }
    } catch (error) {
      console.log(`  ⚠️  Failed to drop ${table}: ${error}`);
    }
  }
  
  // Also drop any sequences that might be left behind
  const sequencesQuery = `
    SELECT sequence_name 
    FROM information_schema.sequences 
    WHERE sequence_schema = 'public';
  `;
  
  const seqResult = await pool.query(sequencesQuery);
  const sequences = seqResult.rows.map(row => row.sequence_name);
  
  for (const sequence of sequences) {
    try {
      await pool.query(`DROP SEQUENCE IF EXISTS "${sequence}" CASCADE;`);
      if (verbose) {
        console.log(`  ✅ Dropped sequence: ${sequence}`);
      }
    } catch (error) {
      console.log(`  ⚠️  Failed to drop sequence ${sequence}: ${error}`);
    }
  }
  
  // Drop any custom types
  const typesQuery = `
    SELECT typname 
    FROM pg_type 
    WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    AND typtype = 'e';
  `;
  
  const typesResult = await pool.query(typesQuery);
  const types = typesResult.rows.map(row => row.typname);
  
  for (const type of types) {
    try {
      await pool.query(`DROP TYPE IF EXISTS "${type}" CASCADE;`);
      if (verbose) {
        console.log(`  ✅ Dropped type: ${type}`);
      }
    } catch (error) {
      console.log(`  ⚠️  Failed to drop type ${type}: ${error}`);
    }
  }
}

/**
 * Alternative nuclear method - drop and recreate the entire public schema
 */
async function recreateSchema(pool: Pool, verbose: boolean = false): Promise<void> {
  if (verbose) {
    console.log('💥 Dropping and recreating public schema...');
  }
  
  try {
    // Drop the entire public schema (this removes EVERYTHING)
    await pool.query('DROP SCHEMA IF EXISTS public CASCADE;');
    if (verbose) {
      console.log('  ✅ Dropped public schema');
    }
    
    // Recreate the public schema
    await pool.query('CREATE SCHEMA public;');
    if (verbose) {
      console.log('  ✅ Recreated public schema');
    }
    
    // Restore default permissions
    await pool.query('GRANT ALL ON SCHEMA public TO postgres;');
    await pool.query('GRANT ALL ON SCHEMA public TO public;');
    if (verbose) {
      console.log('  ✅ Restored default permissions');
    }
  } catch (error) {
    console.error('Schema recreation failed:', error);
    throw error;
  }
}

// Export functions for different use cases
export { clearDatabase };

// Convenient wrapper functions
export async function clearDatabaseSafe() {
  return clearDatabase({ force: false, verbose: true });
}

export async function clearDatabaseForce() {
  return clearDatabase({ force: true, verbose: true });
}

export async function clearDatabaseQuiet() {
  return clearDatabase({ force: true, verbose: false });
}

// Run if executed directly (ES module compatible)
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const args = process.argv.slice(2);
  const hasForceFlag = args.includes('--force');
  const hasVerboseFlag = args.includes('--verbose') || args.includes('-v');
  const hasQuietFlag = args.includes('--quiet') || args.includes('-q');
  
  const options: ClearOptions = {
    force: hasForceFlag,
    verbose: hasVerboseFlag && !hasQuietFlag
  };
  
  clearDatabase(options).catch(error => {
    console.error('Clear failed:', error);
    process.exit(1);
  });
}