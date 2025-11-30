"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import KanjiCard from "@/components/kanjios/KanjiCard";
import { KanjiTypes } from "@/types/kanjiTypes";

export default function KanjiDetail() {
  const [kanji, setKanji] = useState<KanjiTypes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    const fetchKanjiCard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const encodedSlug = encodeURIComponent(slug);
        const response = await fetch(`/api/kanji/${encodedSlug}`);

        if (!response.ok) {
          throw new Error("Failed to fetch kanji detail");
        }
        const data = await response.json();
        setKanji(data);
      } catch (error) {
        console.error("Error fetching kanji detail:", error);
        setError("Failed to load kanji details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchKanjiCard();
    }
  }, [slug]);

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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!kanji) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Not Found</h2>
          <p className="text-gray-500">No kanji data found.</p>
        </div>
      </div>
    );
  }

  return <KanjiCard kanji={kanji} />;
}
