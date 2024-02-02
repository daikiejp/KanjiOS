import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    await prisma.word.deleteMany({});
    console.log('All words have been removed');

    await prisma.kanji.deleteMany({});
    console.log('All kanji have been removed');

    console.log('The database has been successfully cleaned');
  } catch (error) {
    console.error('Error while cleaning the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
