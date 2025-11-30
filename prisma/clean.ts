import prisma from "@/lib/prisma";

async function cleanDatabase() {
  try {
    await prisma.sentence.deleteMany({});
    console.log("All sentences have been removed");

    await prisma.word.deleteMany({});
    console.log("All words have been removed");

    await prisma.kanji.deleteMany({});
    console.log("All kanji have been removed");

    //postgres
    // await prisma.$executeRaw`ALTER SEQUENCE "Sentence_id_seq" RESTART WITH 1`;
    // await prisma.$executeRaw`ALTER SEQUENCE "Word_id_seq" RESTART WITH 1`;
    // await prisma.$executeRaw`ALTER SEQUENCE "Kanji_id_seq" RESTART WITH 1`;
    //sqlite
    await prisma.$executeRaw`DELETE FROM sqlite_sequence;`;
    console.log("Auto-incrementing IDs have been reset");

    console.log("The database has been successfully cleaned");
  } catch (error) {
    console.error("Error while cleaning the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
