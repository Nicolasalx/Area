const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function generateHash(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function executeSqlFile(filePath) {
  let sql = fs.readFileSync(filePath, 'utf8');

  if (filePath.includes('users.sql')) {
    const hashedPassword = "$2b$10$lGpGJ6RStzLtDFsAG/Ngle7no9IZA5SmJSctzL66kLJK/PB2SJqeu"; // password: 'password123'
    sql = sql.replace(/__HASHED_PASSWORD__/g, hashedPassword);
  }

  const queries = sql
    .split(';')
    .map((query) => query.trim())
    .filter((query) => query.length > 0);

  for (const query of queries) {
    try {
      await prisma.$executeRawUnsafe(query);
      console.log(`Request executed: ${query}`);
    } catch (err) {
      if (
        err.code === 'P2010' ||
        (err.code === '23505' && err.meta?.message.includes('already exists'))
      ) {
        console.log(
          `\x1b[31mIn script ${filePath}: Skipping query due to existing data: ${err.meta?.message}\x1b[0m`,
        );
      } else {
        console.error('Error during query execution:', err);
      }
    }
  }
}

async function migrate(scriptsDir) {
  try {
    if (!fs.existsSync(scriptsDir)) {
      throw new Error(`The specified folder does not exist: ${scriptsDir}`);
    }

    const files = fs
      .readdirSync(scriptsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('No SQL files found in the directory.');
      return;
    }

    for (const file of files) {
      const filePath = path.join(scriptsDir, file);
      await executeSqlFile(filePath);
    }

    console.log('Migration successfully completed.');
  } catch (err) {
    console.error('Migration error', err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  const scriptsDir = process.argv[2];
  if (!scriptsDir) {
    console.error('You must specify a folder path containing the SQL files.');
    process.exit(1);
  }
  migrate(scriptsDir);
}

module.exports = migrate;
