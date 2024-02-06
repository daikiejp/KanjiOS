import { promises as fs } from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importKanjiData() {
  const seedDir = path.join(__dirname, 'seeds');
  const files = await fs.readdir(seedDir);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));

  console.log(`Found ${jsonFiles.length} JSON files to process.`);

  let processedCount = 0;
  const batchSize = 50; // Adjust this value based on your needs

  for (let i = 0; i < jsonFiles.length; i += batchSize) {
    const batch = jsonFiles.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (file) => {
        const filePath = path.join(seedDir, file);
        const data = JSON.parse(await fs.readFile(filePath, 'utf8'));

        try {
          await processKanjiData(data);
          processedCount++;
          console.log(
            `Processed ${processedCount}/${jsonFiles.length}: ${file}`
          );
        } catch (error) {
          console.error(`Error processing ${file}:`, error);
        }
      })
    );
  }

  console.log('Finished importing kanji data.');
}

interface KanjiData {
  kanji: string;
  strokes: number;
  reading: string;
  kanji_en: string;
  kanji_es: string;
  on: string[];
  kun: string[];
  jlpt: number;
  words: WordData[];
}

interface WordData {
  word_en: string;
  word_es: string;
  reading: string;
  kanji: string;
  jlpt: number;
  sentences: SentenceData[];
}

interface SentenceData {
  sentence: string;
  furigana: string;
  sentence_es: string;
  sentence_en: string;
}

async function processKanjiData(data: KanjiData) {
  const existingKanji = await prisma.kanji.findFirst({
    where: { kanji: data.kanji },
  });

  if (existingKanji) {
    console.log(`Kanji ${data.kanji} already exists. Skipping.`);
    return;
  }
}

importKanjiData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

console.log('Starting kanji data import...');
