// ============================================
// DATABASE TYPES (Prisma models)
// ============================================

export interface Sentence {
  id: number;
  sentence: string;
  furigana: string;
  sentence_es: string;
  sentence_en: string;
  wordId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Word {
  id: number;
  word_en: string;
  word_es: string;
  pos_en: string;
  pos_es: string;
  reading: string;
  kanji: string;
  jlpt: number;
  kanjiId: number;
  createdAt: Date;
  updatedAt: Date;
  sentences: Sentence[];
}

export interface Kanji {
  id: number;
  kanji: string;
  reading: string;
  kanji_en: string;
  kanji_es: string;
  jlpt: number;
  strokes: number;
  grade: string;
  on: string; // Stored as comma-separated string
  kun: string; // Stored as comma-separated string
  createdAt: Date;
  updatedAt: Date;
  words: Word[];
}

// ============================================
// UTILITY TYPES
// ============================================

export type JlptLevel = 1 | 2 | 3 | 4 | 5;

export interface ReadingArray {
  on: string[];
  kun: string[];
}

// ============================================
// FORM TYPES (for react-hook-form)
// ============================================

export interface SentenceFormData {
  id?: number;
  sentence: string;
  furigana: string;
  sentence_es: string;
  sentence_en: string;
}

export interface WordFormData {
  id?: number;
  word_en: string;
  word_es: string;
  reading: string;
  kanji: string;
  jlpt: number;
  sentences: SentenceFormData[];
}

export interface KanjiFormData {
  id?: number;
  kanji: string;
  strokes: number;
  reading: string;
  kanji_en: string;
  kanji_es: string;
  on: string[];
  kun: string[];
  jlpt: number;
  grade: string;
  words: WordFormData[];
}

// ============================================
// API TYPES
// ============================================

export interface CreateKanjiPayload {
  kanji: string;
  strokes: number;
  reading: string;
  kanji_en: string;
  kanji_es: string;
  on: string;
  kun: string;
  jlpt: number;
  grade: string;
  words: {
    word_en: string;
    word_es: string;
    pos_en: string;
    pos_es: string;
    reading: string;
    kanji: string;
    jlpt: number;
    sentences: {
      sentence: string;
      furigana: string;
      sentence_es: string;
      sentence_en: string;
    }[];
  }[];
}

export interface UpdateKanjiPayload extends CreateKanjiPayload {
  id: number;
  words: Array<{
    id?: number;
    word_en: string;
    word_es: string;
    pos_en: string;
    pos_es: string;
    reading: string;
    kanji: string;
    jlpt: number;
    sentences: Array<{
      id?: number;
      sentence: string;
      furigana: string;
      sentence_es: string;
      sentence_en: string;
    }>;
  }>;
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface KanjiCardProps {
  kanji: Kanji;
}

export interface KanjiListProps {
  kanjisPerPage: number;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

export interface JlptBadgeProps {
  jlpt: JlptLevel;
}

export interface WordCardProps {
  word: string;
  reading: string;
  englishMeaning: string;
  spanishMeaning: string;
  jlpt: number;
  sentences: Sentence[];
}
