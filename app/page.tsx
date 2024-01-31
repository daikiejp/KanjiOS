import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-8">
      <h2 className="text-5xl font-bold text-[#29ABE2] text-center">
        Welcome to KanjiOS
      </h2>

      <Card className="w-full max-w-2xl bg-white shadow-lg">
        <CardContent className="p-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            We know that kanji is the hardest part of learning Japanese, which
            is why we provide resources and examples of the 2136 kanji to help
            you learn in the best possible way. You can download the SQLite
            database for web/app development, completely free.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link href="/kanjis">
          <Button className="text-2xl px-8 py-6 bg-[#FF7BAC] hover:bg-[#FF5A93] w-full sm:w-auto">
            List Kanjis
          </Button>
        </Link>
        <Link href="/add-kanji">
          <Button className="text-2xl px-8 py-6 bg-[#29ABE2] hover:bg-[#1A8AC7] w-full sm:w-auto">
            Add Kanji
          </Button>
        </Link>
      </div>
    </div>
  );
}
