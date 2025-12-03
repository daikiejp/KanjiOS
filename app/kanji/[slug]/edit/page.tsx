"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { kanjiSchema, KanjiFormData } from "@/lib/schemas/kanjiSchemas";
import { parseReadings, stringifyReadings } from "@/utils/readings";
import { Kanji, UpdateKanjiPayload } from "@/types";
import { BasicInfo } from "@/components/kanjios/forms/BasicInfo";
import { Readings } from "@/components/kanjios/forms/Readings";
import { WordsAndSentences } from "@/components/kanjios/forms/WordsAndSentences";

export default function EditKanji() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalKanji, setOriginalKanji] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<KanjiFormData>({
    resolver: zodResolver(kanjiSchema),
  });

  // Watch on and kun arrays for the Readings component
  const onReadings = useWatch({ control, name: "on" }) || [""];
  const kunReadings = useWatch({ control, name: "kun" }) || [""];

  const handleOnChange = (newReadings: string[]) => {
    setValue("on", newReadings, { shouldValidate: true });
  };

  const handleKunChange = (newReadings: string[]) => {
    setValue("kun", newReadings, { shouldValidate: true });
  };

  useEffect(() => {
    const fetchKanjiData = async () => {
      try {
        const encodedSlug = encodeURIComponent(slug);
        const response = await fetch(`/api/kanji/${encodedSlug}`);

        if (!response.ok) {
          throw new Error("Failed to fetch kanji data");
        }

        const rawData: Kanji = await response.json();
        setOriginalKanji(rawData.kanji);

        // Parse readings from string to array for the form
        const formData: KanjiFormData = {
          id: rawData.id,
          kanji: rawData.kanji,
          strokes: rawData.strokes,
          reading: rawData.reading,
          kanji_en: rawData.kanji_en,
          kanji_es: rawData.kanji_es,
          on: parseReadings(rawData.on),
          kun: parseReadings(rawData.kun),
          jlpt: rawData.jlpt,
          grade: rawData.grade,
          words: rawData.words.map((word) => ({
            id: word.id,
            word_en: word.word_en,
            word_es: word.word_es,
            reading: word.reading,
            kanji: word.kanji,
            jlpt: word.jlpt,
            sentences: word.sentences.map((sentence) => ({
              id: sentence.id,
              sentence: sentence.sentence,
              furigana: sentence.furigana,
              sentence_es: sentence.sentence_es,
              sentence_en: sentence.sentence_en,
            })),
          })),
        };

        reset(formData);
      } catch (error) {
        console.error("Error fetching kanji data:", error);
        toast({
          title: "Error",
          description: "Failed to load kanji data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchKanjiData();
    }
  }, [slug, reset, toast]);

  const onSubmit = async (data: KanjiFormData) => {
    if (process.env.NODE_ENV === ("production" as string)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: UpdateKanjiPayload = {
        id: data.id!,
        kanji: data.kanji,
        strokes: data.strokes,
        reading: data.reading,
        kanji_en: data.kanji_en,
        kanji_es: data.kanji_es,
        on: stringifyReadings(data.on),
        kun: stringifyReadings(data.kun),
        jlpt: data.jlpt,
        grade: data.grade,
        words: data.words.map((word) => ({
          id: word.id,
          word_en: word.word_en,
          word_es: word.word_es,
          reading: word.reading,
          kanji: word.kanji,
          jlpt: word.jlpt,
          sentences: word.sentences.map((sentence) => ({
            id: sentence.id,
            sentence: sentence.sentence,
            furigana: sentence.furigana,
            sentence_es: sentence.sentence_es,
            sentence_en: sentence.sentence_en,
          })),
        })),
      };

      const encodedSlug = encodeURIComponent(slug);
      const response = await fetch(`/api/kanji/${encodedSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update kanji");
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: "Kanji updated successfully",
      });

      router.push(`/kanji/${encodeURIComponent(result.kanji)}`);
    } catch (error) {
      console.error("Error updating kanji:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update kanji. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF7BAC]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-[#FF7BAC]">
            Edit Kanji: {originalKanji}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger className="px-4 py-3 text-lg" value="basic">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger className="px-4 py-3 text-lg" value="readings">
                  Readings
                </TabsTrigger>
                <TabsTrigger className="px-4 py-3 text-lg" value="words">
                  Words & Sentences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <BasicInfo control={control} errors={errors} />
              </TabsContent>

              <TabsContent value="readings">
                <Readings
                  control={control}
                  onReadings={onReadings}
                  kunReadings={kunReadings}
                  onOnChange={handleOnChange}
                  onKunChange={handleKunChange}
                />
              </TabsContent>

              <TabsContent value="words">
                <WordsAndSentences control={control} />
              </TabsContent>
            </Tabs>

            <Button
              type="submit"
              className="w-full bg-[#FF7BAC] hover:bg-[#FF5A93] text-white text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Kanji"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
