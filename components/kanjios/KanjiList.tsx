'use client';

import { useState, useEffect } from 'react';
import { KanjiListCard } from '@/components/kanjios/KanjiListCard';
import { SearchInput } from '@/components/kanjios/SearchInput';
import { Pagination } from '@/components/kanjios/Pagination';
import { KanjiListProps, KanjiTypes } from '@/types/kanjiTypes';

export default function KanjiList({ kanjisPerPage }: KanjiListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [kanjis, setKanjis] = useState<KanjiTypes[]>([]);
  const [filteredKanjis, setFilteredKanjis] = useState<KanjiTypes[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF7BAC]"></div>
      </div>
    );
  }

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
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentKanjis.map((kanji) => (
          <KanjiListCard key={kanji.id} {...kanji} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredKanjis.length / kanjisPerPage)}
        onPageChange={paginate}
      />
    </div>
  );
}
