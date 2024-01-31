'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const wordSchema = z.object({
  word_en: z.string().min(1, 'English word is required'),
  word_es: z.string().min(1, 'Spanish word is required'),
  reading: z.string().min(1, 'Reading is required'),
  kanji: z.string().min(1, 'Kanji is required'),
  jlpt: z.number().min(1).max(5),
  sentence: z.string().min(1, 'Sentence is required'),
  sentence_es: z.string().min(1, 'Spanish sentence is required'),
  sentence_en: z.string().min(1, 'English sentence is required'),
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

export default function AddKanji() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof kanjiSchema>>({
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
          sentence: '',
          sentence_es: '',
          sentence_en: '',
        },
      ],
    },
  });

  const { fields: onFields, append: appendOn } = useFieldArray({
    control,
    name: 'on',
  });

  const { fields: kunFields, append: appendKun } = useFieldArray({
    control,
    name: 'kun',
  });

  const { fields: wordFields, append: appendWord } = useFieldArray({
    control,
    name: 'words',
  });

  const onSubmit = async (data: z.infer<typeof kanjiSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/kanji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit kanji');
      }

      toast({
        title: 'Success',
        description: 'Kanji added successfully',
      });

      reset();
    } catch (err) {
      console.log(err);
      toast({
        title: 'Error',
        description: 'Failed to add kanji. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-2xl mx-auto p-4"
    >
      <h2 className="text-4xl font-bold text-[#29ABE2]">Add New Kanji</h2>

      <div>
        <Label htmlFor="kanji">Kanji</Label>
        <Controller
          name="kanji"
          control={control}
          render={({ field }) => (
            <Input {...field} id="kanji" className="text-4xl" />
          )}
        />
        {errors.kanji && <p className="text-red-500">{errors.kanji.message}</p>}
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
              onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
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
          <div key={field.id}>
            <Controller
              name={`on.${index}`}
              control={control}
              render={({ field }) => <Input {...field} className="mt-2" />}
            />
          </div>
        ))}
        <Button type="button" onClick={() => appendOn('')} className="mt-2">
          Add ON Reading
        </Button>
      </div>

      <div>
        <Label>KUN Readings</Label>
        {kunFields.map((field, index) => (
          <div key={field.id}>
            <Controller
              name={`kun.${index}`}
              control={control}
              render={({ field }) => <Input {...field} className="mt-2" />}
            />
          </div>
        ))}
        <Button type="button" onClick={() => appendKun('')} className="mt-2">
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
              onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
            />
          )}
        />
        {errors.jlpt && <p className="text-red-500">{errors.jlpt.message}</p>}
      </div>

      <div>
        <Label>Words</Label>
        {wordFields.map((field, index) => (
          <div key={field.id} className="space-y-4 mb-8 p-4 border rounded">
            <div>
              <Label htmlFor={`words.${index}.word_en`}>English Word</Label>
              <Controller
                name={`words.${index}.word_en`}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={`words.${index}.word_en`} />
                )}
              />
            </div>
            <div>
              <Label htmlFor={`words.${index}.word_es`}>Spanish Word</Label>
              <Controller
                name={`words.${index}.word_es`}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={`words.${index}.word_es`} />
                )}
              />
            </div>
            <div>
              <Label htmlFor={`words.${index}.reading`}>Reading</Label>
              <Controller
                name={`words.${index}.reading`}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={`words.${index}.reading`} />
                )}
              />
            </div>
            <div>
              <Label htmlFor={`words.${index}.kanji`}>Kanji</Label>
              <Controller
                name={`words.${index}.kanji`}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={`words.${index}.kanji`} />
                )}
              />
            </div>
            <div>
              <Label htmlFor={`words.${index}.jlpt`}>JLPT Level</Label>
              <Controller
                name={`words.${index}.jlpt`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id={`words.${index}.jlpt`}
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
              <Label htmlFor={`words.${index}.sentence`}>
                Japanese Sentence
              </Label>
              <Controller
                name={`words.${index}.sentence`}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={`words.${index}.sentence`} />
                )}
              />
            </div>
            <div>
              <Label htmlFor={`words.${index}.sentence_es`}>
                Spanish Sentence
              </Label>
              <Controller
                name={`words.${index}.sentence_es`}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={`words.${index}.sentence_es`} />
                )}
              />
            </div>
            <div>
              <Label htmlFor={`words.${index}.sentence_en`}>
                English Sentence
              </Label>
              <Controller
                name={`words.${index}.sentence_en`}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={`words.${index}.sentence_en`} />
                )}
              />
            </div>
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
              sentence: '',
              sentence_es: '',
              sentence_en: '',
            })
          }
          className="mt-2"
        >
          Add Word
        </Button>
      </div>

      <Button
        type="submit"
        className="bg-[#FF7BAC] hover:bg-[#FF5A93] w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
