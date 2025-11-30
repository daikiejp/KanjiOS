import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

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
    } = body;

    if (
      !kanji ||
      !reading ||
      !kanji_en ||
      !kanji_es ||
      !words ||
      !Array.isArray(words)
    ) {
      return NextResponse.json(
        { error: "Missing required fields or invalid data structure" },
        { status: 400 },
      );
    }

    const existingKanji = await prisma.kanji.findUnique({
      where: { kanji: body.kanji },
    });

    if (existingKanji) {
      return NextResponse.json(
        { error: `Kanji ${body.kanji} already exists. Skipping.` },
        { status: 409 },
      );
    }

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
          create: words.map(
            (word: {
              word_en?: string;
              word_es?: string;
              reading?: string;
              kanji?: string;
              jlpt?: number;
              sentences?: {
                sentence?: string;
                furigana?: string;
                sentence_es?: string;
                sentence_en?: string;
              }[];
            }) => ({
              word_en: word.word_en || "",
              word_es: word.word_es || "",
              reading: word.reading || "",
              kanji: word.kanji || "",
              jlpt: word.jlpt || 5,
              kanjiKanji: kanji,
              sentences: {
                create: (word.sentences || []).map(
                  (sentence: {
                    sentence?: string;
                    furigana?: string;
                    sentence_es?: string;
                    sentence_en?: string;
                  }) => ({
                    sentence: sentence.sentence || "",
                    furigana: sentence.furigana || "",
                    sentence_es: sentence.sentence_es || "",
                    sentence_en: sentence.sentence_en || "",
                  }),
                ),
              },
            }),
          ),
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
      { error: "Failed to add kanji", details: (error as Error).message },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const kanjis = await prisma.kanji.findMany({
      include: { words: true },
    });

    return NextResponse.json(kanjis);
  } catch (error) {
    console.error("Error fetching kanjis:", error);
    return NextResponse.json(
      { error: "Error fetching kanjis" },
      { status: 500 },
    );
  }
}
