'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

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

interface Word {
  id: number;
  word_en: string;
  word_es: string;
  reading: string;
  kanji: string;
  jlpt: number;
  sentence: string;
  furigana: string;
  sentence_es: string;
  sentence_en: string;
}

export default function KanjiDetail() {
  const [kanji, setKanji] = useState<Kanji | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    fetchKanjiDetail();
  }, [id]);

  const fetchKanjiDetail = async () => {
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
    return <div>Error: {error}</div>;
  }

  if (!kanji) {
    return <div>No kanji data found.</div>;
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
                <Link href={`/kanjis/${kanji.id}/edit`} passHref>
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
              <h2 className="text-2xl font-semibold mb-2">Readings</h2>
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
                      englishMeaning={word.word_en}
                      spanishMeaning={word.word_es}
                      jlpt={word.jlpt}
                      furigana={word.furigana}
                      sentence={word.sentence}
                      englishSentence={word.sentence_en}
                      spanishSentence={word.sentence_es}
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

function WordCard({
  word,
  reading,
  englishMeaning,
  spanishMeaning,
  jlpt,
  furigana,
  sentence,
  englishSentence,
  spanishSentence,
}: {
  word: string;
  reading: string;
  englishMeaning: string;
  spanishMeaning: string;
  jlpt: number;
  furigana: string;
  sentence: string;
  englishSentence: string;
  spanishSentence: string;
}) {
  const [showFurigana, setShowFurigana] = useState(false);

  const renderFurigana = useMemo(() => {
    // this was the source of the problems
    // thanks to: https://gist.github.com/ryanmcgrath/982242
    const kanjiRegex = /(.*?)([\u4E00-\u9FAF]+)\((.*?)\)/g;
    const result = [];
    let lastIndex = 0;
    let match;

    while ((match = kanjiRegex.exec(furigana)) !== null) {
      // hide 'fullmatch' regex for no warnings but let the space.
      const [, textBefore, kanji, reading] = match;

      if (textBefore) {
        result.push(textBefore);
      }

      result.push(
        <ruby key={match.index}>
          {kanji === word ? (
            <span className="font-bold text-[#FF7BAC] leading-[2.5rem] h-[2.7rem]">
              {kanji}
            </span>
          ) : (
            kanji
          )}
          <rt>{reading}</rt>
        </ruby>
      );

      lastIndex = kanjiRegex.lastIndex;
    }

    if (lastIndex < furigana.length) {
      result.push(furigana.slice(lastIndex));
    }

    return result;
  }, [furigana, word]);

  const renderSentence = useMemo(() => {
    const kanjiRegex = /([\u4E00-\u9FAF]+)/g;
    const result = [];
    let lastIndex = 0;
    let match;

    while ((match = kanjiRegex.exec(sentence)) !== null) {
      const [kanji] = match;

      if (lastIndex < match.index) {
        result.push(sentence.slice(lastIndex, match.index));
      }

      result.push(
        kanji === word ? (
          <span
            key={`kanji-${match.index}`}
            className="font-bold text-[#FF7BAC] leading-[2.5rem] h-[2.7rem]"
          >
            {kanji}
          </span>
        ) : (
          <span key={`kanji-${match.index}`}>{kanji}</span>
        )
      );

      lastIndex = kanjiRegex.lastIndex;
    }

    if (lastIndex < sentence.length) {
      result.push(sentence.slice(lastIndex));
    }

    return result;
  }, [sentence, word]);

  return (
    <Card className="bg-gray-50">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xl">
            <span className="font-bold text-[#FF7BAC]">{word}</span> ({reading})
          </p>
          <Badge variant="secondary">JLPT N{jlpt}</Badge>
        </div>
        <div className="flex space-x-4 mb-3">
          <div>
            <Badge variant="outline" className="mb-1">
              EN
            </Badge>
            <p>{englishMeaning}</p>
          </div>
          <div>
            <Badge variant="outline" className="mb-1">
              ES
            </Badge>
            <p>{spanishMeaning}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-white p-3 rounded-md">
            <div className="flex justify-between items-start">
              <p className="text-lg mb-1 leading-loose flex-grow">
                {showFurigana ? renderFurigana : renderSentence}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFurigana(!showFurigana)}
                className="ml-2"
                disabled={!furigana}
              >
                {showFurigana ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Badge variant="outline" className="mb-1">
                EN
              </Badge>
              <p className="text-sm text-gray-600">{englishSentence}</p>
            </div>
            <div>
              <Badge variant="outline" className="mb-1">
                ES
              </Badge>
              <p className="text-sm text-gray-600">{spanishSentence}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
