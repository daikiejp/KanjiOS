'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Kanji {
  id: number;
  kanji: string;
  reading: string;
  kanji_en: string;
  kanji_es: string;
  jlpt: number;
}

export default function KanjiList() {
  const [kanjis, setKanjis] = useState<Kanji[]>([]);
  const [filteredKanjis, setFilteredKanjis] = useState<Kanji[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const kanjisPerPage = 20;

  useEffect(() => {
    fetchKanjis();
  }, []);

  useEffect(() => {
    const filtered = kanjis.filter(
      (kanji) =>
        kanji.kanji.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kanji.kanji_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kanji.kanji_es.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredKanjis(filtered);
    setCurrentPage(1);
  }, [searchTerm, kanjis]);

  const fetchKanjis = async () => {
    try {
      const response = await fetch('/api/kanji');
      if (!response.ok) {
        throw new Error('Failed to fetch kanjis');
      }
      const data = await response.json();
      setKanjis(data);
      setFilteredKanjis(data);
    } catch (error) {
      console.error('Error fetching kanjis:', error);
    }
  };

  const indexOfLastKanji = currentPage * kanjisPerPage;
  const indexOfFirstKanji = indexOfLastKanji - kanjisPerPage;
  const currentKanjis = filteredKanjis.slice(
    indexOfFirstKanji,
    indexOfLastKanji
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-[#29ABE2] mb-6">Kanji List</h1>
      <Input
        type="text"
        placeholder="Search kanji, English or Spanish meaning"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentKanjis.map((kanji) => (
          <Link href={`/kanji/${kanji.id}`} key={kanji.id}>
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-[#FF7BAC] text-white cursor-pointer">
                <CardTitle className="text-center">
                  <span className="text-4xl font-bold">{kanji.kanji}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-lg mb-2">{kanji.reading}</p>
                <p className="mb-1">
                  <span className="font-medium">English:</span> {kanji.kanji_en}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Español:</span> {kanji.kanji_es}
                </p>
                <Badge variant="secondary">JLPT N{kanji.jlpt}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex justify-center space-x-2">
        {Array.from(
          { length: Math.ceil(filteredKanjis.length / kanjisPerPage) },
          (_, i) => (
            <Button
              key={i}
              onClick={() => paginate(i + 1)}
              variant={currentPage === i + 1 ? 'default' : 'outline'}
            >
              {i + 1}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
