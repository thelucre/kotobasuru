// src/data/sentences/konbini.ts
import { Sentence } from "@/types/sentence";

export const konbiniSentences: Sentence[] = [
  {
    id: "s001",
    text: {
      kanji: "おにぎりを買いました。",
      kana: "おにぎりをかいました。",
      romaji: "Onigiri o kaimashita.",
      english: "I bought a rice ball.",
    },
    tokens: [
      {
        id: "おにぎり",
        text: { kanji: "おにぎり", kana: "おにぎり", romaji: "onigiri" },
        type: "word",
      },
      {
        id: "を",
        text: { kanji: "を", kana: "を", romaji: "o" },
        type: "particle",
      },
      {
        id: "買いました",
        text: { kanji: "買いました", kana: "かいました", romaji: "kaimashita" },
        type: "verb",
      },
    ],
    tags: ["konbini"],
    vocabIds: ["おにぎり", "買う"],
    grammarIds: ["〜を", "〜ました"],
  },
  // add 49 more...
];
