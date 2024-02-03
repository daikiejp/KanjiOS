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

async function processKanjiData(data) {
  const existingKanji = await prisma.kanji.findFirst({
    where: { kanji: data.kanji },
  });

  if (existingKanji) {
    console.log(`Kanji ${data.kanji} already exists. Skipping.`);
    return;
  }

  await prisma.kanji.create({
    data: {
      kanji: data.kanji,
      strokes: data.strokes,
      reading: data.reading,
      kanji_en: data.kanji_en,
      kanji_es: data.kanji_es,
      on: data.on,
      kun: data.kun,
      jlpt: data.jlpt,
      words: {
        create: data.words.map((word) => ({
          word_en: word.word_en,
          word_es: word.word_es,
          reading: word.reading,
          kanji: word.kanji,
          jlpt: word.jlpt,
          sentences: {
            create: word.sentences.map((sentence) => ({
              sentence: sentence.sentence,
              furigana: sentence.furigana,
              sentence_es: sentence.sentence_es,
              sentence_en: sentence.sentence_en,
            })),
          },
        })),
      },
    },
  });
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
