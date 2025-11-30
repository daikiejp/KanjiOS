import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const slug = decodeURIComponent((await context.params).slug);

  if (!slug) {
    return NextResponse.json(
      { error: "Invalid slug parameter" },
      { status: 400 },
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
      grade,
      words,
    } = body;

    const updatedKanji = await prisma.$transaction(async (prisma) => {
      await prisma.kanji.update({
        where: { kanji: slug },
        data: {
          kanji,
          strokes,
          reading,
          kanji_en,
          kanji_es,
          on,
          kun,
          jlpt,
          grade,
        },
      });

      interface Word {
        id?: number;
        kanji: string;
        word_en: string;
        word_es: string;
        reading: string;
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

      const existingWords = await prisma.word.findMany({
        where: { kanjiKanji: slug },
        include: { sentences: true },
      });

      const wordIdsToKeep = words
        .filter((w: Word) => w.id)
        .map((w: Word) => w.id);

      const wordsToDelete = existingWords.filter(
        (w) => !wordIdsToKeep.includes(w.id),
      );

      for (const word of wordsToDelete) {
        await prisma.word.delete({
          where: { id: word.id },
        });
      }

      for (const word of words) {
        let wordRecord;

        if (word.id) {
          wordRecord = await prisma.word.update({
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
          wordRecord = await prisma.word.create({
            data: {
              kanji: word.kanji,
              word_en: word.word_en,
              word_es: word.word_es,
              reading: word.reading,
              jlpt: word.jlpt,
              kanjiKanji: kanji,
            },
          });
        }

        const existingSentences = word.id
          ? await prisma.sentence.findMany({
              where: { wordId: word.id },
            })
          : [];

        const sentenceIdsToKeep = word.sentences
          .filter((s: Sentence) => s.id)
          .map((s: Sentence) => s.id);

        const sentencesToDelete = existingSentences.filter(
          (s) => !sentenceIdsToKeep.includes(s.id),
        );

        for (const sentence of sentencesToDelete) {
          await prisma.sentence.delete({
            where: { id: sentence.id },
          });
        }

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
                wordId: wordRecord.id,
              },
            });
          }
        }
      }

      return prisma.kanji.findUnique({
        where: { kanji: kanji },
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
      return NextResponse.json({ error: "Kanji not found" }, { status: 404 });
    }

    return NextResponse.json(updatedKanji);
  } catch (error) {
    console.error("Error updating kanji:", error);
    return NextResponse.json(
      { error: "Failed to update kanji", details: (error as Error).message },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const slug = decodeURIComponent((await context.params).slug);

  if (!slug) {
    return NextResponse.json(
      { error: "Invalid slug parameter" },
      { status: 400 },
    );
  }

  try {
    const kanji = await prisma.kanji.findUnique({
      where: { kanji: slug },
      include: {
        words: {
          include: {
            sentences: true,
          },
        },
      },
    });

    if (!kanji) {
      return NextResponse.json({ error: "Kanji not found" }, { status: 404 });
    }

    return NextResponse.json(kanji);
  } catch (error) {
    console.error("Error fetching kanji:", error);
    return NextResponse.json(
      { error: "Failed to fetch kanji" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
