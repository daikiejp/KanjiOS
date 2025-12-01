import * as z from "zod";

export const sentenceSchema = z.object({
  id: z.number().optional(),
  sentence: z.string().min(1, "Sentence is required"),
  furigana: z.string().min(1, "Furigana is required"),
  sentence_es: z.string().min(1, "Spanish sentence is required"),
  sentence_en: z.string().min(1, "English sentence is required"),
});

export const wordSchema = z.object({
  id: z.number().optional(),
  word_en: z.string().min(1, "English word is required"),
  word_es: z.string().min(1, "Spanish word is required"),
  reading: z.string().min(1, "Reading is required"),
  kanji: z.string().min(1, "Kanji is required"),
  jlpt: z.number().min(1).max(5),
  sentences: z
    .array(sentenceSchema)
    .min(1, "At least one sentence is required"),
});

export const kanjiSchema = z.object({
  id: z.number().optional(),
  kanji: z.string().min(1, "Kanji is required"),
  strokes: z.number().min(1, "Number of strokes is required"),
  reading: z.string().min(1, "Reading is required"),
  kanji_en: z.string().min(1, "English meaning is required"),
  kanji_es: z.string().min(1, "Spanish meaning is required"),
  on: z.array(z.string()).min(1, "At least one ON reading is required"),
  kun: z.array(z.string()).min(1, "At least one KUN reading is required"),
  jlpt: z.number().min(1).max(5),
  grade: z.string().min(1, "Grade is required"),
  words: z.array(wordSchema).min(1, "At least one word is required"),
});

export type SentenceFormData = z.infer<typeof sentenceSchema>;
export type WordFormData = z.infer<typeof wordSchema>;
export type KanjiFormData = z.infer<typeof kanjiSchema>;
