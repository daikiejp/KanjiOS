import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { CreateKanjiPayload } from "@/types";
import { stringifyReadings } from "@/utils/readings";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      kanji,
      strokes,
      reading,
      kanji_en,
      kanji_es,
      on,
      kun,
      jlpt,
      grade,
      words,
    } = body as CreateKanjiPayload;

    // Validate required fields
    if (
      !kanji ||
      !reading ||
      !kanji_en ||
      !kanji_es ||
      !on ||
      !kun ||
      !grade ||
      !words ||
      !Array.isArray(words)
    ) {
      return NextResponse.json(
        { error: "Missing required fields or invalid data structure" },
        { status: 400 },
      );
    }

    // Check if kanji already exists
    const existingKanji = await prisma.kanji.findUnique({
      where: { kanji },
    });

    if (existingKanji) {
      return NextResponse.json(
        { error: `Kanji ${kanji} already exists` },
        { status: 409 },
      );
    }

    // Create kanji with nested relations
    const newKanji = await prisma.kanji.create({
      data: {
        kanji,
        strokes: strokes || 1,
        reading,
        kanji_en,
        kanji_es,
        on,
        kun,
        jlpt: jlpt || 5,
        grade,
        words: {
          create: words.map((word) => ({
            word_en: word.word_en,
            word_es: word.word_es,
            reading: word.reading,
            kanji: word.kanji,
            jlpt: word.jlpt || 5,
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
      include: {
        words: {
          include: {
            sentences: true,
          },
        },
      },
    });

    return NextResponse.json(newKanji, { status: 201 });
  } catch (error) {
    console.error("Error adding kanji:", error);
    return NextResponse.json(
      {
        error: "Failed to add kanji",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const kanjis = await prisma.kanji.findMany({
      include: {
        words: {
          include: {
            sentences: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(kanjis);
  } catch (error) {
    console.error("Error fetching kanjis:", error);
    return NextResponse.json(
      { error: "Failed to fetch kanjis" },
      { status: 500 },
    );
  }
}
