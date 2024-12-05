const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function executeSqlFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');

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
          `Skipping query due to existing data: ${err.meta?.message}`,
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
      .filter((file) => file.endsWith('.sql'));

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

const scriptsDir = process.argv[2];

if (!scriptsDir) {
  console.error('You must specify a folder path containing the SQL files.');
  process.exit(1);
}

migrate(scriptsDir);
