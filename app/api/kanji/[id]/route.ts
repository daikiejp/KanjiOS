import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await context.params).id, 10);

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

      interface Word {
        id?: number;
        word_en: string;
        word_es: string;
        reading: string;
        kanji: string;
        jlpt: number;
        sentences: Sentence[];
      }

      interface Sentence {
        id?: number;
        sentence: string;
        furigana: string;
        sentence_es: string;
        sentence_en: string;
      }

      const wordIdsToKeep = words.map((w: Word) => w.id).filter(Boolean);

      const wordsToDelete = await prisma.word.findMany({
        where: {
          kanjiId: id,
          id: { notIn: wordIdsToKeep },
        },
        include: {
          sentences: true,
        },
      });

      for (const word of wordsToDelete) {
        await prisma.sentence.deleteMany({
          where: { wordId: word.id },
        });
      }

      await prisma.word.deleteMany({
        where: {
          kanjiId: id,
          id: { notIn: wordIdsToKeep },
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

        const sentenceIdsToKeep = word.sentences
          .map((s: Sentence) => s.id)
          .filter(Boolean);

        await prisma.sentence.deleteMany({
          where: {
            wordId: updatedWord.id,
            id: { notIn: sentenceIdsToKeep },
          },
        });

        for (const sentence of word.sentences) {
          if (sentence.id) {
            await prisma.sentence.update({
              where: { id: sentence.id },
              data: {
                sentence: sentence.sentence,
                furigana: sentence.furigana,
                sentence_es: sentence.sentence_es,
                sentence_en: sentence.sentence_en,
              },
            });
          } else {
            await prisma.sentence.create({
              data: {
                sentence: sentence.sentence,
                furigana: sentence.furigana,
                sentence_es: sentence.sentence_es,
                sentence_en: sentence.sentence_en,
                wordId: updatedWord.id,
              },
            });
          }
        }
      }

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

    const parsedKanji = {
      ...updatedKanji,
      on: JSON.parse(updatedKanji.on),
      kun: JSON.parse(updatedKanji.kun),
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
  context: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await context.params).id, 10);

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

    const parsedKanji = {
      ...kanji,
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
