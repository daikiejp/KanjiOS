import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CreateKanjiPayload } from "@/types";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  try {
    const body = await request.json();

    // Handle both single kanji and array of kanjis
    const kanjisToImport: CreateKanjiPayload[] = Array.isArray(body)
      ? body
      : [body];

    if (kanjisToImport.length === 0) {
      return NextResponse.json(
        { error: "No kanji data provided" },
        { status: 400 },
      );
    }

    const results = {
      imported: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const kanjiData of kanjisToImport) {
      try {
        // Validate required fields
        if (
          !kanjiData.kanji ||
          !kanjiData.reading ||
          !kanjiData.kanji_en ||
          !kanjiData.kanji_es ||
          !kanjiData.grade ||
          !kanjiData.words ||
          !Array.isArray(kanjiData.words)
        ) {
          results.errors.push(
            `Invalid data structure for kanji: ${kanjiData.kanji || "unknown"}`,
          );
          results.skipped++;
          continue;
        }

        // Check if kanji already exists
        const existingKanji = await prisma.kanji.findUnique({
          where: { kanji: kanjiData.kanji },
        });

        if (existingKanji) {
          results.errors.push(`Kanji ${kanjiData.kanji} already exists`);
          results.skipped++;
          continue;
        }

        // Create kanji with nested relations
        await prisma.kanji.create({
          data: {
            kanji: kanjiData.kanji,
            strokes: kanjiData.strokes || 1,
            reading: kanjiData.reading,
            kanji_en: kanjiData.kanji_en,
            kanji_es: kanjiData.kanji_es,
            on: kanjiData.on || "",
            kun: kanjiData.kun || "",
            jlpt: kanjiData.jlpt || 5,
            grade: kanjiData.grade,
            words: {
              create: kanjiData.words.map((word) => ({
                word_en: word.word_en || "",
                word_es: word.word_es || "",
                pos_en: word.pos_en || "",
                pos_es: word.pos_es || "",
                reading: word.reading || "",
                kanji: word.kanji || "",
                jlpt: word.jlpt || 5,
                sentences: {
                  create: (word.sentences || []).map((sentence) => ({
                    sentence: sentence.sentence || "",
                    furigana: sentence.furigana || "",
                    sentence_es: sentence.sentence_es || "",
                    sentence_en: sentence.sentence_en || "",
                  })),
                },
              })),
            },
          },
        });

        results.imported++;
      } catch (error) {
        console.error(`Error importing kanji ${kanjiData.kanji}:`, error);
        results.errors.push(
          `Failed to import ${kanjiData.kanji}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        results.skipped++;
      }
    }

    // Determine response status
    const status =
      results.imported === 0
        ? 400
        : results.skipped > 0
          ? 207 // Multi-Status
          : 201;

    return NextResponse.json(
      {
        message: `Import complete: ${results.imported} imported, ${results.skipped} skipped`,
        imported: results.imported,
        skipped: results.skipped,
        errors: results.errors.length > 0 ? results.errors : undefined,
      },
      { status },
    );
  } catch (error) {
    console.error("Error importing kanji:", error);
    return NextResponse.json(
      {
        error: "Failed to import kanji",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
