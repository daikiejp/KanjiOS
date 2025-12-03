import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kanji } = body;

    if (!kanji) {
      return NextResponse.json(
        { error: "Kanji character is required" },
        { status: 400 },
      );
    }

    // Fetch kanji with all related data
    const kanjiData = await prisma.kanji.findUnique({
      where: { kanji },
      include: {
        words: {
          include: {
            sentences: true,
          },
        },
      },
    });

    if (!kanjiData) {
      return NextResponse.json({ error: "Kanji not found" }, { status: 404 });
    }

    // Remove database-specific fields for cleaner export
    const exportData = {
      kanji: kanjiData.kanji,
      strokes: kanjiData.strokes,
      reading: kanjiData.reading,
      kanji_en: kanjiData.kanji_en,
      kanji_es: kanjiData.kanji_es,
      on: kanjiData.on,
      kun: kanjiData.kun,
      jlpt: kanjiData.jlpt,
      grade: kanjiData.grade,
      words: kanjiData.words.map((word) => ({
        word_en: word.word_en,
        word_es: word.word_es,
        reading: word.reading,
        pos_en: word.pos_en,
        pos_es: word.pos_es,
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

    // Convert to JSON string with formatting
    const jsonData = JSON.stringify(exportData, null, 2);

    // Return as downloadable file
    return new NextResponse(jsonData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
          kanji.json,
        )}`,
      },
    });
  } catch (error) {
    console.error("Error exporting kanji:", error);
    return NextResponse.json(
      {
        error: "Failed to export kanji",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
