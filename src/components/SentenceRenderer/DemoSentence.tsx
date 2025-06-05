// src/screens/DemoSentence.tsx
import { SentenceRenderer } from "./index";
import { View } from "react-native";

// Token colors by part of speech/type
const TOKEN_COLORS: Record<string, string> = {
  word: "#e63946", // red (nouns)
  particle: "#ffb4a2", // salmon
  grammar: "#a8dadc", // light blue (grammar/adjective/etc.)
  verb: "#b5e48c", // lime
};

const exampleSentence = {
  id: "s012",
  text: {
    kanji: "お金がないので、コンビニに行きません。",
    kana: "おかねがないので、コンビニにいきません。",
    romaji: "Okane ga nai node, konbini ni ikimasen.",
    english: "Since I have no money, I won’t go to the convenience store.",
  },
  tokens: [
    {
      id: "お金",
      text: { kanji: "お金", kana: "おかね", romaji: "okane" },
      xp: 10,
      type: "word",
    },
    {
      id: "が",
      text: { kanji: "が", kana: "が", romaji: "ga" },
      type: "particle",
    },
    {
      id: "ない",
      text: { kanji: "ない", kana: "ない", romaji: "nai" },
      type: "grammar",
    },
    {
      id: "ので",
      text: { kanji: "ので", kana: "ので", romaji: "node" },
      type: "grammar",
    },
    {
      id: "コンビニ",
      text: { kanji: "コンビニ", kana: "コンビニ", romaji: "konbini" },
      xp: 4,
      type: "word",
    },
    {
      id: "に",
      text: { kanji: "に", kana: "に", romaji: "ni" },
      type: "particle",
    },
    {
      id: "行きません",
      text: { kanji: "行きません", kana: "いきません", romaji: "ikimasen" },
      type: "grammar", // if you'd rather tag this as 'verb', color will change
    },
  ],
  tags: ["konbini", "reason"],
  vocabIds: ["お金", "ない", "コンビニ", "行く"],
  grammarIds: ["〜が", "〜ので", "〜ません"],
};

export default function DemoSentence() {
  const coloredTokens = exampleSentence.tokens.map((t) => ({
    ...t,
    color: TOKEN_COLORS[t.type] || "#ddd",
  }));

  return (
    <View>
      <SentenceRenderer
        sentence={{ ...exampleSentence, tokens: coloredTokens }}
      />
    </View>
  );
}
