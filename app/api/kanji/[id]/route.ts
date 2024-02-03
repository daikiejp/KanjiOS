import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { error: 'Missing id parameter' },
      { status: 400 }
    );
  }

  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid id parameter' },
      { status: 400 }
    );
  }

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
      words,
    } = body;

    const updatedKanji = await prisma.$transaction(async (prisma) => {
      await prisma.kanji.update({
        where: { id },
        data: {
          kanji,
          strokes,
          reading,
          kanji_en,
          kanji_es,
          on: JSON.stringify(on),
          kun: JSON.stringify(kun),
          jlpt,
        },
      });

      for (const word of words) {
        let updatedWord;
        if (word.id) {
          updatedWord = await prisma.word.update({
            where: { id: word.id },
            data: {
              word_en: word.word_en,
              word_es: word.word_es,
              reading: word.reading,
              kanji: word.kanji,
              jlpt: word.jlpt,
            },
          });
        } else {
          updatedWord = await prisma.word.create({
            data: {
              word_en: word.word_en,
              word_es: word.word_es,
              reading: word.reading,
              kanji: word.kanji,
              jlpt: word.jlpt,
              kanjiId: id,
            },
          });
        }

        const updatedSentenceIds = [];
        for (const sentence of word.sentences) {
          let updatedSentence;
          if (sentence.id) {
            updatedSentence = await prisma.sentence.update({
              where: { id: sentence.id },
              data: {
                sentence: sentence.sentence,
                furigana: sentence.furigana,
                sentence_es: sentence.sentence_es,
                sentence_en: sentence.sentence_en,
              },
            });
          } else {
            updatedSentence = await prisma.sentence.create({
              data: {
                sentence: sentence.sentence,
                furigana: sentence.furigana,
                sentence_es: sentence.sentence_es,
                sentence_en: sentence.sentence_en,
                wordId: updatedWord.id,
              },
            });
          }
          updatedSentenceIds.push(updatedSentence.id);
        }

        await prisma.sentence.deleteMany({
          where: {
            wordId: updatedWord.id,
            id: { notIn: updatedSentenceIds },
          },
        });
      }

      await prisma.word.deleteMany({
        where: {
          kanjiId: id,
          id: { notIn: words.map((w) => w.id).filter(Boolean) },
        },
      });

      return prisma.kanji.findUnique({
        where: { id },
        include: {
          words: {
            include: {
              sentences: true,
            },
          },
        },
      });
    });

    if (!updatedKanji) {
      return NextResponse.json({ error: 'Kanji not found' }, { status: 404 });
    }

    // Parse JSON strings back to arrays
    const parsedKanji = {
      ...updatedKanji,
      on: JSON.parse(updatedKanji.on as string),
      kun: JSON.parse(updatedKanji.kun as string),
    };

    return NextResponse.json(parsedKanji);
  } catch (error) {
    console.error('Error updating kanji:', error);
    return NextResponse.json(
      { error: 'Failed to update kanji' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { error: 'Missing id parameter' },
      { status: 400 }
    );
  }

  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid id parameter' },
      { status: 400 }
    );
  }

  try {
    const kanji = await prisma.kanji.findUnique({
      where: { id },
      include: {
        words: {
          include: {
            sentences: true,
          },
        },
      },
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
      { error: 'Failed to fetch kanji' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
