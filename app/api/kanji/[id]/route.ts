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
