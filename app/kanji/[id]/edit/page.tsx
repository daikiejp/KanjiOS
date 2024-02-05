'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

const sentenceSchema = z.object({
  id: z.number().optional(),
  sentence: z.string().min(1, 'Sentence is required'),
  furigana: z.string().min(1, 'Furigana is required'),
  sentence_es: z.string().min(1, 'Spanish sentence is required'),
  sentence_en: z.string().min(1, 'English sentence is required'),
});

const wordSchema = z.object({
  id: z.number().optional(),
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
  id: z.number(),
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

const BasicInfo: React.FC<{
  control: Control<KanjiFormData>;
  errors: any;
}> = ({ control, errors }) => (
  <div className="space-y-4 mt-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="kanji" className="text-lg">
          Kanji
        </Label>
        <Controller
          name="kanji"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="kanji"
              className="text-4xl h-20 text-center"
            />
          )}
        />
        {errors.kanji && (
          <p className="text-red-500 text-sm mt-1">{errors.kanji.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="strokes" className="text-lg">
          Strokes
        </Label>
        <Controller
          name="strokes"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="strokes"
              type="number"
              min="1"
              onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              className="text-2xl h-20 text-center"
            />
          )}
        />
        {errors.strokes && (
          <p className="text-red-500 text-sm mt-1">{errors.strokes.message}</p>
        )}
      </div>
    </div>
    <div>
      <Label htmlFor="reading" className="text-lg">
        Reading
      </Label>
      <Controller
        name="reading"
        control={control}
        render={({ field }) => (
          <Input {...field} id="reading" className="text-xl" />
        )}
      />
      {errors.reading && (
        <p className="text-red-500 text-sm mt-1">{errors.reading.message}</p>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="kanji_en" className="text-lg">
          English Meaning
        </Label>
        <Controller
          name="kanji_en"
          control={control}
          render={({ field }) => <Input {...field} id="kanji_en" />}
        />
        {errors.kanji_en && (
          <p className="text-red-500 text-sm mt-1">{errors.kanji_en.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="kanji_es" className="text-lg">
          Spanish Meaning
        </Label>
        <Controller
          name="kanji_es"
          control={control}
          render={({ field }) => <Input {...field} id="kanji_es" />}
        />
        {errors.kanji_es && (
          <p className="text-red-500 text-sm mt-1">{errors.kanji_es.message}</p>
        )}
      </div>
    </div>
    <div>
      <Label htmlFor="jlpt" className="text-lg">
        JLPT Level
      </Label>
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
            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
            className="text-2xl h-12 text-center"
          />
        )}
      />
      {errors.jlpt && (
        <p className="text-red-500 text-sm mt-1">{errors.jlpt.message}</p>
      )}
    </div>
  </div>
);

const Readings: React.FC<{
  control: Control<KanjiFormData>;
  onFields: any[];
  kunFields: any[];
  appendOn: () => void;
  appendKun: () => void;
  removeOn: (index: number) => void;
  removeKun: (index: number) => void;
}> = ({
  control,
  onFields,
  kunFields,
  appendOn,
  appendKun,
  removeOn,
  removeKun,
}) => (
  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <Label className="text-lg">ON Readings</Label>
      {onFields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2 mt-2">
          <Controller
            name={`on.${index}`}
            control={control}
            render={({ field }) => <Input {...field} className="flex-grow" />}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => removeOn(index)}
            className="flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={appendOn}
        className="mt-2 w-full bg-[#29ABE2] hover:bg-[#1A8ED1] text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add ON Reading
      </Button>
    </div>
    <div>
      <Label className="text-lg">KUN Readings</Label>
      {kunFields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2 mt-2">
          <Controller
            name={`kun.${index}`}
            control={control}
            render={({ field }) => <Input {...field} className="flex-grow" />}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => removeKun(index)}
            className="flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={appendKun}
        className="mt-2 w-full bg-[#29ABE2] hover:bg-[#1A8ED1] text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add KUN Reading
      </Button>
    </div>
  </div>
);

const Sentence: React.FC<{
  wordIndex: number;
  sentenceIndex: number;
  control: Control<KanjiFormData>;
  onRemove: () => void;
}> = ({ wordIndex, sentenceIndex, control, onRemove }) => (
  <Accordion type="single" collapsible className="bg-gray-50 rounded-lg">
    <AccordionItem value={`sentence-${sentenceIndex}`}>
      <AccordionTrigger className="px-4 py-2 hover:bg-gray-100">
        <div className="flex justify-between w-full">
          <span className="font-medium">Sentence {sentenceIndex + 1}</span>
          <Controller
            name={`words.${wordIndex}.sentences.${sentenceIndex}.sentence`}
            control={control}
            render={({ field }) => (
              <span className="text-sm text-gray-500">
                {field.value.slice(0, 30)}...
              </span>
            )}
          />
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 py-2">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label
              htmlFor={`words.${wordIndex}.sentences.${sentenceIndex}.sentence`}
            >
              Japanese Sentence
            </Label>
            <Controller
              name={`words.${wordIndex}.sentences.${sentenceIndex}.sentence`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={`words.${wordIndex}.sentences.${sentenceIndex}.sentence`}
                  className="mt-1"
                />
              )}
            />
          </div>
          <div>
            <Label
              htmlFor={`words.${wordIndex}.sentences.${sentenceIndex}.furigana`}
            >
              Furigana
            </Label>
            <Controller
              name={`words.${wordIndex}.sentences.${sentenceIndex}.furigana`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={`words.${wordIndex}.sentences.${sentenceIndex}.furigana`}
                  className="mt-1"
                />
              )}
            />
          </div>
          <div>
            <Label
              htmlFor={`words.${wordIndex}.sentences.${sentenceIndex}.sentence_es`}
            >
              Spanish Sentence
            </Label>
            <Controller
              name={`words.${wordIndex}.sentences.${sentenceIndex}.sentence_es`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={`words.${wordIndex}.sentences.${sentenceIndex}.sentence_es`}
                  className="mt-1"
                />
              )}
            />
          </div>
          <div>
            <Label
              htmlFor={`words.${wordIndex}.sentences.${sentenceIndex}.sentence_en`}
            >
              English Sentence
            </Label>
            <Controller
              name={`words.${wordIndex}.sentences.${sentenceIndex}.sentence_en`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={`words.${wordIndex}.sentences.${sentenceIndex}.sentence_en`}
                  className="mt-1"
                />
              )}
            />
          </div>
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={onRemove}
          className="mt-3"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remove Sentence
        </Button>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const Word: React.FC<{
  wordIndex: number;
  control: Control<KanjiFormData>;
  onRemove: () => void;
}> = ({ wordIndex, control, onRemove }) => {
  const {
    fields: sentenceFields,
    append: appendSentence,
    remove: removeSentence,
  } = useFieldArray({
    control,
    name: `words.${wordIndex}.sentences` as const,
  });

  return (
    <AccordionItem value={`word-${wordIndex}`}>
      <AccordionTrigger className="text-lg font-medium">
        <div className="flex items-center justify-between w-full">
          <span>Word {wordIndex + 1}</span>
          <Controller
            name={`words.${wordIndex}.kanji`}
            control={control}
            render={({ field }) => (
              <span className="text-2xl font-bold">{field.value}</span>
            )}
          />
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor={`words.${wordIndex}.reading`}>Reading</Label>
              <Controller
                name={`words.${wordIndex}.reading`}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={`words.${wordIndex}.reading`} />
                )}
              />
            </div>
            <div>
              <Label htmlFor={`words.${wordIndex}.word_en`}>English Word</Label>
              <Controller
                name={`words.${wordIndex}.word_en`}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={`words.${wordIndex}.word_en`} />
                )}
              />
            </div>
            <div>
              <Label htmlFor={`words.${wordIndex}.word_es`}>Spanish Word</Label>
              <Controller
                name={`words.${wordIndex}.word_es`}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={`words.${wordIndex}.word_es`} />
                )}
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor={`words.${wordIndex}.jlpt`}>JLPT Level</Label>
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
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  className="w-20 text-center"
                />
              )}
            />
          </div>
          <div className="mt-4">
            <Label className="text-lg font-semibold">Sentences</Label>
            <div className="space-y-4">
              {sentenceFields.map((sentenceField, sentenceIndex) => (
                <Sentence
                  key={sentenceField.id}
                  wordIndex={wordIndex}
                  sentenceIndex={sentenceIndex}
                  control={control}
                  onRemove={() => removeSentence(sentenceIndex)}
                />
              ))}
              <Button
                type="button"
                onClick={() =>
                  appendSentence({
                    sentence: '',
                    furigana: '',
                    sentence_es: '',
                    sentence_en: '',
                  })
                }
                className="w-full bg-[#29ABE2] hover:bg-[#1A8ED1] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Sentence
              </Button>
            </div>
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={onRemove}
            className="mt-4"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Word
          </Button>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
};

const WordsAndSentences: React.FC<{
  control: Control<KanjiFormData>;
  wordFields: any[];
  appendWord: () => void;
  removeWord: (index: number) => void;
}> = ({ control, wordFields, appendWord, removeWord }) => (
  <div className="space-y-4 mt-4">
    <Accordion type="single" collapsible className="w-full">
      {wordFields.map((wordField, wordIndex) => (
        <Word
          key={wordField.id}
          wordIndex={wordIndex}
          control={control}
          onRemove={() => removeWord(wordIndex)}
        />
      ))}
    </Accordion>
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
      className="w-full bg-[#29ABE2] hover:bg-[#1A8ED1] text-white"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add Word
    </Button>
  </div>
);

export default function EditKanji() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KanjiFormData>({
    resolver: zodResolver(kanjiSchema),
    defaultValues: {
      id: 0,
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

  useEffect(() => {
    const fetchKanjiData = async () => {
      try {
        const response = await fetch(`/api/kanji/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch kanji data');
        }
        const data = await response.json();
        reset(data);
      } catch (error) {
        console.error('Error fetching kanji data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load kanji data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchKanjiData();
  }, [id, reset, toast]);

  const onSubmit = async (data: KanjiFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/kanji/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update kanji');
      }

      toast({
        title: 'Success',
        description: 'Kanji updated successfully',
      });

      router.push(`/kanji/${id}`);
    } catch (error) {
      console.error('Error updating kanji:', error);
      toast({
        title: 'Error',
        description: 'Failed to update kanji. Please try again.',
        variant: 'destructive',
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
            Edit Kanji
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
                  onFields={onFields}
                  kunFields={kunFields}
                  appendOn={() => appendOn('')}
                  appendKun={() => appendKun('')}
                  removeOn={removeOn}
                  removeKun={removeKun}
                />
              </TabsContent>
              <TabsContent value="words">
                <WordsAndSentences
                  control={control}
                  wordFields={wordFields}
                  appendWord={appendWord}
                  removeWord={removeWord}
                />
              </TabsContent>
            </Tabs>

            <Button
              type="submit"
              className="w-full bg-[#FF7BAC] hover:bg-[#FF5A93] text-white text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Kanji'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
