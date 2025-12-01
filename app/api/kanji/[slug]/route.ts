import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UpdateKanjiPayload } from "@/types";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const decodedSlug = decodeURIComponent(slug);

    if (!decodedSlug) {
      return NextResponse.json(
        { error: "Invalid slug parameter" },
        { status: 400 },
      );
    }

    const kanji = await prisma.kanji.findUnique({
      where: { kanji: decodedSlug },
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
      {
        error: "Failed to fetch kanji",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const decodedSlug = decodeURIComponent(slug);

    if (!decodedSlug) {
      return NextResponse.json(
        { error: "Invalid slug parameter" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as UpdateKanjiPayload;

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

    // Update kanji and related data in a transaction
    const updatedKanji = await prisma.$transaction(async (tx) => {
      // Get the existing kanji to retrieve its ID
      const existingKanji = await tx.kanji.findUnique({
        where: { kanji: decodedSlug },
        include: {
          words: {
            include: {
              sentences: true,
            },
          },
        },
      });

      if (!existingKanji) {
        throw new Error("Kanji not found");
      }

      // Update basic kanji info
      await tx.kanji.update({
        where: { kanji: decodedSlug },
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

      // Get word IDs to keep
      const wordIdsToKeep = words
        .filter((w) => w.id !== undefined)
        .map((w) => w.id as number);

      // Delete words not in the update
      const wordsToDelete = existingKanji.words.filter(
        (w) => !wordIdsToKeep.includes(w.id),
      );

      for (const word of wordsToDelete) {
        await tx.word.delete({ where: { id: word.id } });
      }

      // Update or create words
      for (const word of words) {
        let wordId: number;

        if (word.id) {
          // Update existing word
          await tx.word.update({
            where: { id: word.id },
            data: {
              word_en: word.word_en,
              word_es: word.word_es,
              reading: word.reading,
              kanji: word.kanji,
              jlpt: word.jlpt,
            },
          });
          wordId = word.id;

          // Get existing sentences for this word
          const existingSentences = await tx.sentence.findMany({
            where: { wordId: word.id },
          });

          // Get sentence IDs to keep
          const sentenceIdsToKeep = word.sentences
            .filter((s) => s.id !== undefined)
            .map((s) => s.id as number);

          // Delete sentences not in the update
          const sentencesToDelete = existingSentences.filter(
            (s) => !sentenceIdsToKeep.includes(s.id),
          );

          for (const sentence of sentencesToDelete) {
            await tx.sentence.delete({ where: { id: sentence.id } });
          }
        } else {
          // Create new word
          const newWord = await tx.word.create({
            data: {
              kanji: word.kanji,
              word_en: word.word_en,
              word_es: word.word_es,
              reading: word.reading,
              jlpt: word.jlpt,
              kanjiId: existingKanji.id,
            },
          });
          wordId = newWord.id;
        }

        // Update or create sentences
        for (const sentence of word.sentences) {
          if (sentence.id) {
            await tx.sentence.update({
              where: { id: sentence.id },
              data: {
                sentence: sentence.sentence,
                furigana: sentence.furigana,
                sentence_es: sentence.sentence_es,
                sentence_en: sentence.sentence_en,
              },
            });
          } else {
            await tx.sentence.create({
              data: {
                sentence: sentence.sentence,
                furigana: sentence.furigana,
                sentence_es: sentence.sentence_es,
                sentence_en: sentence.sentence_en,
                wordId: wordId,
              },
            });
          }
        }
      }

      // Return updated kanji with all relations
      return tx.kanji.findUnique({
        where: { kanji },
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
      {
        error: "Failed to update kanji",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
