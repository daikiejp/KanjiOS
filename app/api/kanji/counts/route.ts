import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [sentences, words, kanji] = await Promise.all([
      prisma.sentence.count(),
      prisma.word.count(),
      prisma.kanji.count(),
    ]);

    return NextResponse.json({
      sentences,
      words,
      kanji,
    });
  } catch (error) {
    console.error("Error getting counts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
