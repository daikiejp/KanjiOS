import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Jlpt from '@/components/kanjios/Jlpt2';

interface KanjiCardProps {
  id: number;
  kanji: string;
  reading: string;
  kanji_en: string;
  kanji_es: string;
  jlpt: number;
}

export function KanjiListCard({
  id,
  kanji,
  reading,
  kanji_en,
  kanji_es,
  jlpt,
}: KanjiCardProps) {
  return (
    <Link href={`/kanji/${id}`}>
      <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-[#FF7BAC] text-white cursor-pointer">
          <CardTitle className="text-center">
            <span className="text-4xl font-bold">{kanji}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between">
            <p className="text-lg mb-2">{reading}</p>
            <div>
              <Jlpt jlpt={jlpt as 1 | 2 | 3 | 4 | 5} />
            </div>
          </div>

          <div className="flex justify-between items-center space-x-4 my-3">
            <div>
              <Badge variant="outline" className="mb-1">
                EN
              </Badge>
              <p>{kanji_en}</p>
            </div>
            <div>
              <Badge variant="outline" className="mb-1">
                ES
              </Badge>
              <p>{kanji_es}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
