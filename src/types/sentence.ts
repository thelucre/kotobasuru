// src/types/sentence.ts
export type WordTokenData = {
  id: string;
  text: {
    kanji: string;
    kana: string;
    romaji: string;
  };
  xp?: number;
  type: "word" | "particle" | "grammar";
};

export type Sentence = {
  id: string;
  text: {
    kanji: string;
    kana: string;
    romaji: string;
    english: string;
  };
  tokens: WordTokenData[];
  tags: string[];
  vocabIds: string[];
  grammarIds: string[];
};
