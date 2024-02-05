'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import KanjiCard from '@/components/kanjios/KanjiCard';
import { KanjiTypes } from '@/types/kanjiTypes';

export default function KanjiDetail() {
  const [kanji, setKanji] = useState<KanjiTypes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
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

    fetchKanjiCard();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF7BAC]"></div>
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
