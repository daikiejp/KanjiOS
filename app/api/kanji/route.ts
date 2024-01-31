import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const kanji = await prisma.kanji.create({
      data: {
        kanji: data.kanji,
        strokes: data.strokes,
        reading: data.reading,
        kanji_en: data.kanji_en,
        kanji_es: data.kanji_es,
        on: JSON.stringify(data.on),
        kun: JSON.stringify(data.kun),
        jlpt: data.jlpt,
        words: {
          create: data.words.map((word: any) => ({
            word_en: word.word_en,
            word_es: word.word_es,
            reading: word.reading,
            kanji: word.kanji,
            jlpt: word.jlpt,
            sentence: word.sentence,
            sentence_es: word.sentence_es,
            sentence_en: word.sentence_en,
          })),
        },
      },
    });

    return NextResponse.json(kanji);
  } catch (error) {
    console.error('Error creating kanji:', error);
    return NextResponse.json(
      { error: 'Error creating kanji' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const kanjis = await prisma.kanji.findMany({
      include: { words: true },
    });

    // Parse JSON strings back to arrays
    const parsedKanjis = kanjis.map((kanji) => ({
      ...kanji,
      on: JSON.parse(kanji.on),
      kun: JSON.parse(kanji.kun),
    }));

    return NextResponse.json(parsedKanjis);
  } catch (error) {
    console.error('Error fetching kanjis:', error);
    return NextResponse.json(
      { error: 'Error fetching kanjis' },
      { status: 500 }
    );
  }
}
