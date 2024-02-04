'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import KanjiCard from '@/components/kanjios/KanjiCard';

interface Sentence {
  id: number;
  sentence: string;
  furigana: string;
  sentence_es: string;
  sentence_en: string;
}

interface Word {
  id: number;
  word_en: string;
  word_es: string;
  reading: string;
  kanji: string;
  jlpt: number;
  sentences: Sentence[];
}

interface Kanji {
  id: number;
  kanji: string;
  reading: string;
  kanji_en: string;
  kanji_es: string;
  jlpt: number;
  strokes: number;
  on: string[];
  kun: string[];
  words: Word[];
}

export default function KanjiDetail() {
  const [kanji, setKanji] = useState<Kanji | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    fetchKanjiCard();
  }, [id]);

  const fetchKanjiCard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/kanji/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch kanji detail');
      }
      const data = await response.json();
      setKanji(data);
    } catch (error) {
      console.error('Error fetching kanji detail:', error);
      setError('Failed to load kanji details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  if (!kanji) {
    return (
      <div className="h-screen flex items-center justify-center">
        No kanji data found.
      </div>
    );
  }

  return <KanjiCard kanji={kanji} />;
}
