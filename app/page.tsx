import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-8">
      <h2 className="text-5xl font-bold text-[#29ABE2]">Welcome to KanjiOS</h2>
      <div className="flex space-x-4">
        <Link href="/kanjis">
          <Button className="text-2xl px-8 py-6 bg-[#FF7BAC] hover:bg-[#FF5A93]">
            List Kanjis
          </Button>
        </Link>
        <Link href="/add-kanji">
          <Button className="text-2xl px-8 py-6 bg-[#29ABE2] hover:bg-[#1A8AC7]">
            Add Kanji
          </Button>
        </Link>
      </div>
    </div>
  );
}
