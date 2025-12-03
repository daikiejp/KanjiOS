"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Counts {
  sentences: number;
  words: number;
  kanji: number;
}

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [counts, setCounts] = useState<Counts | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCounts().then(setCounts).catch(console.error);
  }, []);

  async function fetchCounts() {
    const res = await fetch("/api/kanji/counts");
    if (!res.ok) throw new Error("Error getting counts");
    return res.json();
  }

  if (!counts) return console.log("error");

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast({
        title: "Invalid file",
        description: "Please select a JSON file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const response = await fetch("/api/kanji/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error.errors[0]);
        throw new Error("Failed to import: " + error.errors[0]);
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: result.message || "Kanji imported successfully",
      });
    } catch (error) {
      console.error("Error importing kanji:" + error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to import kanji",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
            you learn in the best possible way. You can also download the JSON
            files for web/app development, completely free.
          </p>
        </CardContent>
      </Card>

      <div className="w-full max-w-md">
        <Button className="w-full h-14 text-2xl bg-green-500 hover:bg-green-700">
          Download
        </Button>
        <p className="text-center mt-2 text-sm text-gray-600">
          v0.1.0-alpha{" "}
          <span className="text-gray-500">(not ready for production)</span>
        </p>
        <p className="text-center text-sm text-gray-500">
          Kanji: {counts.kanji}, Words: {counts.words}, Sentences:{" "}
          {counts.sentences}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link href="/kanji">
          <Button className="text-2xl px-8 py-6 bg-[#FF7BAC] hover:bg-[#FF5A93] w-full sm:w-auto">
            List Kanjis
          </Button>
        </Link>
        <Link href="/kanji/add">
          <Button className="text-2xl px-8 py-6 bg-[#29ABE2] hover:bg-[#1A8AC7] w-full sm:w-auto">
            Add Kanji
          </Button>
        </Link>

        {process.env.NODE_ENV !== "production" && (
          <>
            <Button
              className="text-2xl px-8 py-6 bg-purple-500 hover:bg-purple-700 w-full sm:w-auto"
              onClick={handleImportClick}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-6 w-6" />
              {isUploading ? "Importing..." : "Import Kanji"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
