export interface Sentence {
  id: number;
  sentence: string;
  furigana: string;
  sentence_es: string;
  sentence_en: string;
}

export interface Word {
  id: number;
  word_en: string;
  word_es: string;
  reading: string;
  kanji: string;
  jlpt: number;
  sentences: Sentence[];
}

export interface KanjiTypes {
  id: number;
  kanji: string;
  reading: string;
  kanji_en: string;
  kanji_es: string;
  jlpt: number;
  strokes: number;
  on: string[];
  kun: string[];
  words: Word[];
}

export interface KanjiCardProps {
  kanji: KanjiTypes;
}
