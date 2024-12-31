import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KanjiCardProps } from '@/types/kanjiTypes';
import Link from 'next/link';
import WordCard from '@/components/kanjios/WordCard';
import Jlpt from '@/components/kanjios/Jlpt2';
import Animate from './Animate';

export default function KanjiCard({ kanji }: KanjiCardProps) {
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
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
            <div className="flex justify-start">
              <div className="flex flex-col items-start mb-2">
                <h2 className="text-2xl font-semibold">Details</h2>
                <div className="space-y-4">
                  <p className="mt-4">
                    <span className="font-medium">Strokes:</span>{' '}
                    {kanji.strokes}
                  </p>
                  <span className="font-medium">Level:</span>{' '}
                  <Jlpt jlpt={kanji.jlpt as 1 | 2 | 3 | 4 | 5} />
                </div>
                <Link
                  className="pt-4 block md:hidden"
                  href={`/kanji/${kanji.id}/edit`}
                  passHref
                >
                  <Button variant="outline">Edit Kanji</Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center space-y-2">
              <div className="flex flex-col items-start mb-2">
                <h2 className="text-2xl font-semibold">Readings</h2>
                <div className="mt-4">
                  <span className="font-medium">On&apos;yomi:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {kanji.on.map((reading, index) => (
                      <Badge
                        className="text-md font-normal"
                        key={index}
                        variant="secondary"
                      >
                        {reading}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <span className="font-medium">Kun&apos;yomi:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {kanji.kun.map((reading, index) => (
                      <Badge
                        className="text-md font-normal"
                        key={index}
                        variant="outline"
                      >
                        {reading}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <Link
                className="hidden md:block"
                href={`/kanji/${kanji.id}/edit`}
                passHref
              >
                <Button variant="outline">Edit Kanji</Button>
              </Link>
              {/* <Animate /> */}
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
