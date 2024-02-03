'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus } from 'lucide-react';

const sentenceSchema = z.object({
  sentence: z.string().min(1, 'Sentence is required'),
  furigana: z.string().min(1, 'Furigana is required'),
  sentence_es: z.string().min(1, 'Spanish sentence is required'),
  sentence_en: z.string().min(1, 'English sentence is required'),
});

const wordSchema = z.object({
  word_en: z.string().min(1, 'English word is required'),
  word_es: z.string().min(1, 'Spanish word is required'),
  reading: z.string().min(1, 'Reading is required'),
  kanji: z.string().min(1, 'Kanji is required'),
  jlpt: z.number().min(1).max(5),
  sentences: z
    .array(sentenceSchema)
    .min(1, 'At least one sentence is required'),
});

const kanjiSchema = z.object({
  kanji: z.string().min(1, 'Kanji is required'),
  strokes: z.number().min(1, 'Number of strokes is required'),
  reading: z.string().min(1, 'Reading is required'),
  kanji_en: z.string().min(1, 'English meaning is required'),
  kanji_es: z.string().min(1, 'Spanish meaning is required'),
  on: z.array(z.string()).min(1, 'At least one ON reading is required'),
  kun: z.array(z.string()).min(1, 'At least one KUN reading is required'),
  jlpt: z.number().min(1).max(5),
  words: z.array(wordSchema).min(1, 'At least one word is required'),
});

type KanjiFormData = z.infer<typeof kanjiSchema>;

export default function AddKanji() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<KanjiFormData>({
    resolver: zodResolver(kanjiSchema),
    defaultValues: {
      kanji: '',
      strokes: 1,
      reading: '',
      kanji_en: '',
      kanji_es: '',
      on: [''],
      kun: [''],
      jlpt: 5,
      words: [
        {
          word_en: '',
          word_es: '',
          reading: '',
          kanji: '',
          jlpt: 5,
          sentences: [
            {
              sentence: '',
              furigana: '',
              sentence_es: '',
              sentence_en: '',
            },
          ],
        },
      ],
    },
  });

  const {
    fields: onFields,
    append: appendOn,
    remove: removeOn,
  } = useFieldArray({
    control,
    name: 'on',
  });

  const {
    fields: kunFields,
    append: appendKun,
    remove: removeKun,
  } = useFieldArray({
    control,
    name: 'kun',
  });

  const {
    fields: wordFields,
    append: appendWord,
    remove: removeWord,
  } = useFieldArray({
    control,
    name: 'words',
  });

  const onSubmit = async (data: KanjiFormData) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        on: data.on.filter((reading) => reading.trim() !== ''),
        kun: data.kun.filter((reading) => reading.trim() !== ''),
        words: data.words.map((word) => ({
          ...word,
          jlpt: word.jlpt || 5,
          sentences: word.sentences.map((sentence) => ({
            sentence: sentence.sentence || '',
            furigana: sentence.furigana || '',
            sentence_es: sentence.sentence_es || '',
            sentence_en: sentence.sentence_en || '',
          })),
        })),
      };

      const response = await fetch('/api/kanji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add kanji');
      }

      const result = await response.json();

      toast({
        title: 'Success',
        description: 'Kanji added successfully',
      });

      router.push(`/kanjis/${result.id}`);
    } catch (error) {
      console.error('Error adding kanji:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to add kanji. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#FF7BAC]">
            Add New Kanji
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="kanji">Kanji</Label>
                <Controller
                  name="kanji"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id="kanji" className="text-4xl" />
                  )}
                />
                {errors.kanji && (
                  <p className="text-red-500">{errors.kanji.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="strokes">Number of Strokes</Label>
                <Controller
                  name="strokes"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="strokes"
                      type="number"
                      min="1"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  )}
                />
                {errors.strokes && (
                  <p className="text-red-500">{errors.strokes.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reading">Reading</Label>
                <Controller
                  name="reading"
                  control={control}
                  render={({ field }) => <Input {...field} id="reading" />}
                />
                {errors.reading && (
                  <p className="text-red-500">{errors.reading.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="kanji_en">English Meaning</Label>
                <Controller
                  name="kanji_en"
                  control={control}
                  render={({ field }) => <Input {...field} id="kanji_en" />}
                />
                {errors.kanji_en && (
                  <p className="text-red-500">{errors.kanji_en.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="kanji_es">Spanish Meaning</Label>
                <Controller
                  name="kanji_es"
                  control={control}
                  render={({ field }) => <Input {...field} id="kanji_es" />}
                />
                {errors.kanji_es && (
                  <p className="text-red-500">{errors.kanji_es.message}</p>
                )}
              </div>

              <div>
                <Label>ON Readings</Label>
                {onFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center space-x-2 mt-2"
                  >
                    <Controller
                      name={`on.${index}`}
                      control={control}
                      render={({ field }) => <Input {...field} />}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeOn(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Remove ON reading</span>
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => appendOn('')}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add ON Reading
                </Button>
              </div>

              <div>
                <Label>KUN Readings</Label>
                {kunFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center space-x-2 mt-2"
                  >
                    <Controller
                      name={`kun.${index}`}
                      control={control}
                      render={({ field }) => <Input {...field} />}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeKun(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Remove KUN reading</span>
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => appendKun('')}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add KUN Reading
                </Button>
              </div>

              <div>
                <Label htmlFor="jlpt">JLPT Level</Label>
                <Controller
                  name="jlpt"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="jlpt"
                      type="number"
                      min="1"
                      max="5"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  )}
                />
                {errors.jlpt && (
                  <p className="text-red-500">{errors.jlpt.message}</p>
                )}
              </div>

              <div>
                <Label>Words</Label>
                {wordFields.map((wordField, wordIndex) => (
                  <div
                    key={wordField.id}
                    className="space-y-4 mb-8 p-4 border rounded"
                  >
                    <div>
                      <Label htmlFor={`words.${wordIndex}.word_en`}>
                        English Word
                      </Label>
                      <Controller
                        name={`words.${wordIndex}.word_en`}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} id={`words.${wordIndex}.word_en`} />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`words.${wordIndex}.word_es`}>
                        Spanish Word
                      </Label>
                      <Controller
                        name={`words.${wordIndex}.word_es`}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} id={`words.${wordIndex}.word_es`} />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`words.${wordIndex}.reading`}>
                        Reading
                      </Label>
                      <Controller
                        name={`words.${wordIndex}.reading`}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} id={`words.${wordIndex}.reading`} />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`words.${wordIndex}.kanji`}>Kanji</Label>
                      <Controller
                        name={`words.${wordIndex}.kanji`}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} id={`words.${wordIndex}.kanji`} />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`words.${wordIndex}.jlpt`}>
                        JLPT Level
                      </Label>
                      <Controller
                        name={`words.${wordIndex}.jlpt`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`words.${wordIndex}.jlpt`}
                            type="number"
                            min="1"
                            max="5"
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value, 10))
                            }
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label>Sentences</Label>
                      <Controller
                        name={`words.${wordIndex}.sentences`}
                        control={control}
                        render={({ field }) => (
                          <div>
                            {field.value.map((sentence, sentenceIndex) => (
                              <div
                                key={sentenceIndex}
                                className="space-y-2 mb-4 p-2 border rounded"
                              >
                                <div>
                                  <Label
                                    htmlFor={`words.${wordIndex}.sentences.${sentenceIndex}.sentence`}
                                  >
                                    Japanese Sentence
                                  </Label>
                                  <Input
                                    id={`words.${wordIndex}.sentences.${sentenceIndex}.sentence`}
                                    value={sentence.sentence}
                                    onChange={(e) => {
                                      const newSentences = [...field.value];
                                      newSentences[sentenceIndex].sentence =
                                        e.target.value;
                                      field.onChange(newSentences);
                                    }}
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor={`words.${wordIndex}.sentences.${sentenceIndex}.furigana`}
                                  >
                                    Furigana
                                  </Label>
                                  <Input
                                    id={`words.${wordIndex}.sentences.${sentenceIndex}.furigana`}
                                    value={sentence.furigana}
                                    onChange={(e) => {
                                      const newSentences = [...field.value];
                                      newSentences[sentenceIndex].furigana =
                                        e.target.value;
                                      field.onChange(newSentences);
                                    }}
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor={`words.${wordIndex}.sentences.${sentenceIndex}.sentence_es`}
                                  >
                                    Spanish Sentence
                                  </Label>
                                  <Input
                                    id={`words.${wordIndex}.sentences.${sentenceIndex}.sentence_es`}
                                    value={sentence.sentence_es}
                                    onChange={(e) => {
                                      const newSentences = [...field.value];
                                      newSentences[sentenceIndex].sentence_es =
                                        e.target.value;
                                      field.onChange(newSentences);
                                    }}
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor={`words.${wordIndex}.sentences.${sentenceIndex}.sentence_en`}
                                  >
                                    English Sentence
                                  </Label>
                                  <Input
                                    id={`words.${wordIndex}.sentences.${sentenceIndex}.sentence_en`}
                                    value={sentence.sentence_en}
                                    onChange={(e) => {
                                      const newSentences = [...field.value];
                                      newSentences[sentenceIndex].sentence_en =
                                        e.target.value;
                                      field.onChange(newSentences);
                                    }}
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() => {
                                    const newSentences = [...field.value];
                                    newSentences.splice(sentenceIndex, 1);
                                    field.onChange(newSentences);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remove Sentence
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              onClick={() => {
                                field.onChange([
                                  ...field.value,
                                  {
                                    sentence: '',
                                    furigana: '',
                                    sentence_es: '',
                                    sentence_en: '',
                                  },
                                ]);
                              }}
                            >
                              <Plus className="w-4 h-4" />
                              Add Sentence
                            </Button>
                          </div>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeWord(wordIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Word
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() =>
                    appendWord({
                      word_en: '',
                      word_es: '',
                      reading: '',
                      kanji: '',
                      jlpt: 5,
                      sentences: [
                        {
                          sentence: '',
                          furigana: '',
                          sentence_es: '',
                          sentence_en: '',
                        },
                      ],
                    })
                  }
                  className="mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Word
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#FF7BAC] hover:bg-[#FF5A93]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Kanji'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
