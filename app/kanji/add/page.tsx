"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { kanjiSchema, KanjiFormData } from "@/lib/schemas/kanjiSchemas";
import { stringifyReadings } from "@/utils/readings";
import { CreateKanjiPayload } from "@/types";
import { BasicInfo } from "@/components/kanjios/forms/BasicInfo";
import { Readings } from "@/components/kanjios/forms/Readings";
import { WordsAndSentences } from "@/components/kanjios/forms/WordsAndSentences";

const DEFAULT_SENTENCE = {
  sentence: "",
  furigana: "",
  sentence_es: "",
  sentence_en: "",
};

const DEFAULT_WORD = {
  word_en: "",
  word_es: "",
  reading: "",
  kanji: "",
  jlpt: 5,
  sentences: [DEFAULT_SENTENCE],
};

const DEFAULT_FORM_VALUES: KanjiFormData = {
  kanji: "",
  strokes: 1,
  reading: "",
  kanji_en: "",
  kanji_es: "",
  on: [""],
  kun: [""],
  jlpt: 5,
  grade: "",
  words: [DEFAULT_WORD],
};

export default function AddKanji() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<KanjiFormData>({
    resolver: zodResolver(kanjiSchema),
    defaultValues: DEFAULT_FORM_VALUES,
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

  const onSubmit = async (data: KanjiFormData) => {
    if (process.env.NODE_ENV === ("production" as string)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateKanjiPayload = {
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
          word_en: word.word_en,
          word_es: word.word_es,
          reading: word.reading,
          kanji: word.kanji,
          jlpt: word.jlpt,
          sentences: word.sentences.map((sentence) => ({
            sentence: sentence.sentence,
            furigana: sentence.furigana,
            sentence_es: sentence.sentence_es,
            sentence_en: sentence.sentence_en,
          })),
        })),
      };

      if (process.env.NODE_ENV === "production") {
        console.log("Add Kanji not available in production");
        toast({
          title: "Not Available",
          description: "Adding kanji is not available in production mode",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/kanji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add kanji");
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: "Kanji added successfully",
      });

      router.push(`/kanji/${encodeURIComponent(result.kanji)}`);
    } catch (error) {
      console.error("Error adding kanji:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add kanji. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-[#FF7BAC]">
            Add New Kanji
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
              disabled={isSubmitting || process.env.NODE_ENV === "production"}
            >
              {isSubmitting ? "Adding..." : "Add Kanji"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
