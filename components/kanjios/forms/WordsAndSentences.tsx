import { useFieldArray, Control, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import { KanjiFormData } from "@/lib/schemas/kanjiSchemas";

interface WordsAndSentencesProps {
  control: Control<KanjiFormData>;
}

export function WordsAndSentences({ control }: WordsAndSentencesProps) {
  const {
    fields: wordFields,
    append: appendWord,
    remove: removeWord,
  } = useFieldArray({
    control,
    name: "words",
  });

  return (
    <div className="space-y-4 mt-4">
      <Accordion type="single" collapsible className="w-full">
        {wordFields.map((wordField, wordIndex) => (
          <WordAccordionItem
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
            word_en: "",
            word_es: "",
            pos_en: "",
            pos_es: "",
            reading: "",
            kanji: "",
            jlpt: 5,
            sentences: [
              {
                sentence: "",
                furigana: "",
                sentence_es: "",
                sentence_en: "",
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
}

interface WordAccordionItemProps {
  wordIndex: number;
  control: Control<KanjiFormData>;
  onRemove: () => void;
}

function WordAccordionItem({
  wordIndex,
  control,
  onRemove,
}: WordAccordionItemProps) {
  const {
    fields: sentenceFields,
    append: appendSentence,
    remove: removeSentence,
  } = useFieldArray({
    control,
    name: `words.${wordIndex}.sentences`,
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
              <span className="text-2xl font-bold">{field.value || "—"}</span>
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
            <div>
              <Label htmlFor={`words.${wordIndex}.pos_en`}>
                English Part of Speech
              </Label>
              <Controller
                name={`words.${wordIndex}.pos_en`}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={`words.${wordIndex}.pos_en`} />
                )}
              />
            </div>
            <div>
              <Label htmlFor={`words.${wordIndex}.pos_es`}>
                Spanish Part of Speech
              </Label>
              <Controller
                name={`words.${wordIndex}.pos_es`}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={`words.${wordIndex}.pos_es`} />
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
                  onChange={(e) =>
                    field.onChange(Number.parseInt(e.target.value, 10))
                  }
                  className="w-20 text-center"
                />
              )}
            />
          </div>

          <div className="mt-4">
            <Label className="text-lg font-semibold">Sentences</Label>
            <div className="space-y-4">
              {sentenceFields.map((sentenceField, sentenceIndex) => (
                <SentenceAccordion
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
                    sentence: "",
                    furigana: "",
                    sentence_es: "",
                    sentence_en: "",
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
}

interface SentenceAccordionProps {
  wordIndex: number;
  sentenceIndex: number;
  control: Control<KanjiFormData>;
  onRemove: () => void;
}

function SentenceAccordion({
  wordIndex,
  sentenceIndex,
  control,
  onRemove,
}: SentenceAccordionProps) {
  return (
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
                  {field.value?.slice(0, 30) || ""}...
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
}
