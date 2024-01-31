'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

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
  const form = useForm<z.infer<typeof kanjiSchema>>({
    resolver: zodResolver(kanjiSchema),
    defaultValues: {
      on: [''],
      kun: [''],
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
    control: form.control,
    name: 'on',
  });

  const { fields: kunFields, append: appendKun } = useFieldArray({
    control: form.control,
    name: 'kun',
  });

  const { fields: wordFields, append: appendWord } = useFieldArray({
    control: form.control,
    name: 'words',
  });

  const onSubmit = (data: z.infer<typeof kanjiSchema>) => {
    console.log(data);
    // Here you would typically send this data to your backend
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-12">
        <h2 className="text-4xl font-bold text-[#29ABE2]">Add New Kanji</h2>

        <FormField
          control={form.control}
          name="kanji"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kanji</FormLabel>
              <FormControl>
                <Input {...field} className="text-4xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="strokes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Strokes</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reading</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kanji_en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>English Meaning</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kanji_es"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spanish Meaning</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>ON Readings</FormLabel>
          {onFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`on.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="button" onClick={() => appendOn('')} className="mt-2">
            Add ON Reading
          </Button>
        </div>

        <div>
          <FormLabel>KUN Readings</FormLabel>
          {kunFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`kun.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="button" onClick={() => appendKun('')} className="mt-2">
            Add KUN Reading
          </Button>
        </div>

        <FormField
          control={form.control}
          name="jlpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>JLPT Level</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="1" max="5" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Words</FormLabel>
          {wordFields.map((field, index) => (
            <div key={field.id} className="space-y-4 mb-8 p-4 border rounded">
              <FormField
                control={form.control}
                name={`words.${index}.word_en`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Word</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`words.${index}.word_es`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spanish Word</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`words.${index}.reading`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reading</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`words.${index}.kanji`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kanji</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`words.${index}.jlpt`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>JLPT Level</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" max="5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`words.${index}.sentence`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Japanese Sentence</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`words.${index}.sentence_es`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spanish Sentence</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`words.${index}.sentence_en`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Sentence</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

        <Button type="submit" className="bg-[#FF7BAC] hover:bg-[#FF5A93]">
          Submit
        </Button>
      </form>
    </Form>
  );
}
