import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KanjiFormData } from "@/lib/schemas/kanjiSchemas";

interface BasicInfoProps {
  control: Control<KanjiFormData>;
  errors: FieldErrors<KanjiFormData>;
}

export function BasicInfo({ control, errors }: BasicInfoProps) {
  return (
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
                onChange={(e) =>
                  field.onChange(Number.parseInt(e.target.value, 10))
                }
                className="text-2xl h-20 text-center"
              />
            )}
          />
          {errors.strokes && (
            <p className="text-red-500 text-sm mt-1">
              {errors.strokes.message}
            </p>
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
            <p className="text-red-500 text-sm mt-1">
              {errors.kanji_en.message}
            </p>
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
            <p className="text-red-500 text-sm mt-1">
              {errors.kanji_es.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onChange={(e) =>
                  field.onChange(Number.parseInt(e.target.value, 10))
                }
                className="text-2xl h-12 text-center"
              />
            )}
          />
          {errors.jlpt && (
            <p className="text-red-500 text-sm mt-1">{errors.jlpt.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="grade" className="text-lg">
            Grade Level
          </Label>
          <Controller
            name="grade"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="grade"
                className="text-2xl h-12 text-center"
              />
            )}
          />
          {errors.grade && (
            <p className="text-red-500 text-sm mt-1">{errors.grade.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
