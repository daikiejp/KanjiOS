import { useState, useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import CopySentence from '@/utils/copy';
import Jlpt from '@/components/kanjios/Jlpt';

interface Sentence {
  id: number;
  sentence: string;
  furigana: string;
  sentence_es: string;
  sentence_en: string;
}

export default function WordCard({
  word,
  reading,
  englishMeaning,
  spanishMeaning,
  jlpt,
  sentences,
}: {
  word: string;
  reading: string;
  englishMeaning: string;
  spanishMeaning: string;
  jlpt: number;
  sentences: Sentence[];
}) {
  const [showFurigana, setShowFurigana] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const renderFurigana = useMemo(() => {
    const currentSentence = sentences[currentSentenceIndex];
    if (!currentSentence) return null;

    const kanjiRegex = /(.*?)([\u4E00-\u9FAF]+)\((.*?)\)/g;
    const result = [];
    let lastIndex = 0;
    let match;

    while ((match = kanjiRegex.exec(currentSentence.furigana)) !== null) {
      const [, textBefore, kanji, reading] = match;

      if (textBefore) {
        result.push(textBefore);
      }

      if (kanji.includes(word)) {
        const splitKanji = kanji.split(word);

        if (splitKanji[0]) {
          result.push(
            <ruby key={`kanji-before-${match.index}`}>
              {splitKanji[0]}
              <rt>{reading}</rt>
            </ruby>
          );
        }

        result.push(
          <ruby key={`kanji-highlight-${match.index}`}>
            <span className="font-bold text-[#FF7BAC] leading-[2.5rem] h-[2.7rem]">
              {word}
            </span>
            <rt>{reading}</rt>
          </ruby>
        );

        if (splitKanji[1]) {
          result.push(
            <ruby key={`kanji-after-${match.index}`}>
              {splitKanji[1]}
              <rt>{reading}</rt>
            </ruby>
          );
        }
      } else {
        result.push(
          <ruby key={match.index}>
            {kanji}
            <rt>{reading}</rt>
          </ruby>
        );
      }

      lastIndex = kanjiRegex.lastIndex;
    }

    if (lastIndex < currentSentence.furigana.length) {
      result.push(currentSentence.furigana.slice(lastIndex));
    }

    return result;
  }, [sentences, currentSentenceIndex, word]);

  const renderSentence = useMemo(() => {
    const currentSentence = sentences[currentSentenceIndex];
    if (!currentSentence) return null;

    const kanjiRegex = /([\u4E00-\u9FAF]+)/g;
    const result = [];
    let lastIndex = 0;
    let match;

    while ((match = kanjiRegex.exec(currentSentence.sentence)) !== null) {
      const [kanji] = match;

      if (lastIndex < match.index) {
        result.push(currentSentence.sentence.slice(lastIndex, match.index));
      }

      if (kanji.includes(word)) {
        const splitKanji = kanji.split(word);

        if (splitKanji[0]) {
          result.push(
            <span key={`kanji-before-${match.index}`}>{splitKanji[0]}</span>
          );
        }

        result.push(
          <span
            key={`kanji-highlight-${match.index}`}
            className="font-bold text-[#FF7BAC] leading-[2.5rem] h-[2.7rem]"
          >
            {word}
          </span>
        );

        if (splitKanji[1]) {
          result.push(
            <span key={`kanji-after-${match.index}`}>{splitKanji[1]}</span>
          );
        }
      } else {
        result.push(<span key={`kanji-${match.index}`}>{kanji}</span>);
      }

      lastIndex = kanjiRegex.lastIndex;
    }

    if (lastIndex < currentSentence.sentence.length) {
      result.push(currentSentence.sentence.slice(lastIndex));
    }

    return result;
  }, [sentences, currentSentenceIndex, word]);

  return (
    <Card className="bg-gray-50">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xl">
            <span className="font-bold text-[#FF7BAC]">{word}</span> ({reading})
          </p>
          <Jlpt jlpt={jlpt as 1 | 2 | 3 | 4 | 5} />
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFurigana(!showFurigana)}
                      className="ml-2"
                      disabled={!sentences[currentSentenceIndex]?.furigana}
                    >
                      {showFurigana ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showFurigana ? 'Hide furigana' : 'Show furigana'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <CopySentence
                sentence={sentences[currentSentenceIndex]?.sentence}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Badge variant="outline" className="mb-1">
                EN
              </Badge>
              <p className="text-sm text-gray-600">
                {sentences[currentSentenceIndex]?.sentence_en}
              </p>
            </div>
            <div>
              <Badge variant="outline" className="mb-1">
                ES
              </Badge>
              <p className="text-sm text-gray-600">
                {sentences[currentSentenceIndex]?.sentence_es}
              </p>
            </div>
          </div>
          {sentences.length > 1 && (
            <div className="mt-4 flex justify-between">
              <Button
                onClick={() =>
                  setCurrentSentenceIndex((prev) =>
                    prev > 0 ? prev - 1 : sentences.length - 1
                  )
                }
                variant="outline"
              >
                Previous Sentence
              </Button>
              <Button
                onClick={() =>
                  setCurrentSentenceIndex((prev) =>
                    prev < sentences.length - 1 ? prev + 1 : 0
                  )
                }
                variant="outline"
              >
                Next Sentence
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
