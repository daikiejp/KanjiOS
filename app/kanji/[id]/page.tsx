'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import WordCard from '@/components/kanjios/WordCard';

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

export default function KanjiCard() {
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

  return (
    <div className="container mx-auto p-4 font-sans">
      <Card className="bg-white shadow-lg max-w-4xl mx-auto">
        <CardHeader className="bg-[#FF7BAC] text-white rounded-t-lg">
          <CardTitle className="text-center">
            <span className="text-8xl font-bold">{kanji.kanji}</span>
            <div className="mt-2 text-2xl flex items-center justify-center space-x-2">
              {kanji.reading}
            </div>
            <div className="mt-2 text-2xl flex items-center justify-center space-x-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-white text-[#FF7BAC]">
                  EN
                </Badge>
                <span className="text-white">{kanji.kanji_en}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-white text-[#FF7BAC]">
                  ES
                </Badge>
                <span className="text-white">{kanji.kanji_es}</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold">Details</h2>
                <Link
                  className="visible md:invisible"
                  href={`/kanji/${kanji.id}/edit`}
                  passHref
                >
                  <Button variant="outline">Edit Kanji</Button>
                </Link>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Strokes:</span> {kanji.strokes}
                </p>
                <p>
                  <span className="font-medium">JLPT Level:</span> N{kanji.jlpt}
                </p>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold">Details</h2>
                <Link
                  className="invisible md:visible"
                  href={`/kanji/${kanji.id}/edit`}
                  passHref
                >
                  <Button variant="outline">Edit Kanji</Button>
                </Link>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">On&apos;yomi:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {kanji.on.map((reading, index) => (
                      <Badge key={index} variant="secondary">
                        {reading}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Kun&apos;yomi:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {kanji.kun.map((reading, index) => (
                      <Badge key={index} variant="outline">
                        {reading}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <div>
            <h2 className="text-2xl font-semibold mb-4">Related Words</h2>
            <Tabs
              defaultValue={kanji.words[0]?.id.toString()}
              className="w-full"
            >
              <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
                {kanji.words.map((word) => (
                  <TabsTrigger
                    key={word.id}
                    value={word.id.toString()}
                    className="px-4 py-3 text-lg"
                  >
                    {word.kanji}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="mt-4">
                {kanji.words.map((word) => (
                  <TabsContent key={word.id} value={word.id.toString()}>
                    <WordCard
                      word={word.kanji}
                      reading={word.reading}
                      jlpt={word.jlpt}
                      englishMeaning={word.word_en}
                      spanishMeaning={word.word_es}
                      sentences={word.sentences}
                    />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}