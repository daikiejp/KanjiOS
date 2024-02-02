import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const kanji = await prisma.kanji.findUnique({
      where: { id },
      include: { words: true },
    });

    if (!kanji) {
      return NextResponse.json({ error: 'Kanji not found' }, { status: 404 });
    }

    // Parse JSON strings back to arrays
    const parsedKanji = {
      ...kanji,
      on: JSON.parse(kanji.on as string),
      kun: JSON.parse(kanji.kun as string),
    };

    return NextResponse.json(parsedKanji);
  } catch (error) {
    console.error('Error fetching kanji:', error);
    return NextResponse.json(
      { error: 'Error fetching kanji' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  const data = await request.json();

  try {
    const updatedKanji = await prisma.kanji.update({
      where: { id },
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
          upsert: data.words.map((word: any) => ({
            where: { id: word.id || 0 },
            update: {
              word_en: word.word_en,
              word_es: word.word_es,
              reading: word.reading,
              kanji: word.kanji,
              jlpt: word.jlpt,
              sentence: word.sentence,
              furigana: word.furigana,
              sentence_es: word.sentence_es,
              sentence_en: word.sentence_en,
            },
            create: {
              word_en: word.word_en,
              word_es: word.word_es,
              reading: word.reading,
              kanji: word.kanji,
              jlpt: word.jlpt,
              sentence: word.sentence,
              furigana: word.furigana,
              sentence_es: word.sentence_es,
              sentence_en: word.sentence_en,
            },
          })),
        },
      },
      include: { words: true },
    });

    return NextResponse.json(updatedKanji);
  } catch (error) {
    console.error('Error updating kanji:', error);
    return NextResponse.json(
      { error: 'Error updating kanji' },
      { status: 500 }
    );
  }
}
