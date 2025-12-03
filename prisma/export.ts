import { promises as fs } from "fs";
import path from "path";
import prisma from "@/lib/prisma";

async function exportKanjiData() {
  const exportDir = path.join(__dirname, "exports");

  // Ensure the export directory exists
  await fs.mkdir(exportDir, { recursive: true });

  // Fetch all kanji from the database
  const allKanji = await prisma.kanji.findMany({
    include: {
      words: {
        include: {
          sentences: true,
        },
      },
    },
  });

  console.log(`Found ${allKanji.length} kanji to export.`);

  for (let i = 0; i < allKanji.length; i++) {
    const kanji = allKanji[i];
    const fileName = `${kanji.kanji}.json`;
    const filePath = path.join(exportDir, fileName);

    // Prepare the data for export
    const exportData = {
      kanji: kanji.kanji,
      strokes: kanji.strokes,
      reading: kanji.reading,
      kanji_en: kanji.kanji_en,
      kanji_es: kanji.kanji_es,
      on: kanji.on,
      kun: kanji.kun,
      jlpt: kanji.jlpt,
      grade: kanji.grade,
      words: kanji.words.map((word) => ({
        word_en: word.word_en,
        word_es: word.word_es,
        pos_en: word.pos_en,
        pos_es: word.pos_es,
        reading: word.reading,
        kanji: word.kanji,
        jlpt: word.jlpt,
        sentences: word.sentences.map((sentence) => ({
          sentence: sentence.sentence,
          furigana: sentence.furigana,
          sentence_es: sentence.sentence_es,
          sentence_en: sentence.sentence_en,
        })),
      })),
    };

    // Write the JSON file
    await fs.writeFile(filePath, JSON.stringify(exportData, null, 2), "utf8");

    console.log(`Exported ${i + 1}/${allKanji.length}: ${fileName}`);
  }

  console.log("Finished exporting kanji data.");
}

exportKanjiData()
  .catch((e) => {
    console.error("Error during export:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

console.log("Starting kanji data export...");
