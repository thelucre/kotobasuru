// src/data/grammar.ts
import { type GrammarPoint } from "../types";

export const grammarLibrary: GrammarPoint[] = [
  {
    id: "desu",
    expression: "〜です",
    meaning: "to be (polite)",
    level: "N5",
    examples: ["これはパンです。", "ねこです。"],
  },
  {
    id: "ka",
    expression: "〜か？",
    meaning: "question particle",
    level: "N5",
    examples: ["これはパンですか？", "あなたはせんせいですか？"],
  },
  {
    id: "no",
    expression: "〜の",
    meaning: "possessive / explanatory particle",
    level: "N5",
    examples: ["わたしのくるま", "なんのほん？"],
  },
  {
    id: "wa",
    expression: "〜は",
    meaning: "topic particle",
    level: "N5",
    examples: ["わたしはがくせいです。", "これはみずです。"],
  },
  {
    id: "o",
    expression: "〜を",
    meaning: "direct object particle",
    level: "N5",
    examples: ["パンをたべます。", "みずをのみます。"],
  },
  {
    id: "ni",
    expression: "〜に",
    meaning: "location/time/direction particle",
    level: "N5",
    examples: ["がっこうにいきます。", "６じにおきます。"],
  },
  {
    id: "te-iru",
    expression: "〜ている",
    meaning: "ongoing action/state",
    level: "N5",
    examples: ["たべている", "まっている"],
  },
  {
    id: "tai",
    expression: "〜たい",
    meaning: "want to (do)",
    level: "N5",
    examples: ["のみたい", "かいたいです"],
  },
  {
    id: "kara",
    expression: "〜から",
    meaning: "because / from",
    level: "N5",
    examples: ["おいしいからたべる", "にほんからきました"],
  },
  {
    id: "ga",
    expression: "〜が",
    meaning: "subject marker / contrastive",
    level: "N5",
    examples: ["ねこがいます。", "パンがすきです。"],
  },
];
