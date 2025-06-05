// src/components/SentenceRenderer.tsx
import { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";

type Token = {
  id: string;
  text: {
    kanji: string;
    kana: string;
    romaji: string;
  };
  type: string;
  xp?: number;
  color: string;
};

type Sentence = {
  id: string;
  text: {
    kanji: string;
    kana: string;
    romaji: string;
    english: string;
  };
  tokens: Token[];
};

interface SentenceRendererProps {
  sentence: Sentence;
}

export function SentenceRenderer({ sentence }: SentenceRendererProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line}>
        {sentence.tokens.map((token) => (
          <TokenDisplay key={token.id} token={token} />
        ))}
      </View>
      <Text style={styles.translation}>{sentence.text.english}</Text>
    </View>
  );
}

function TokenDisplay({ token }: { token: Token }) {
  const [displayMode, setDisplayMode] = useState<"kanji" | "kana" | "romaji">(
    "kanji"
  );

  const cycle = () => {
    setDisplayMode((prev) =>
      prev === "kanji" ? "kana" : prev === "kana" ? "romaji" : "kanji"
    );
  };

  return (
    <Pressable onPress={cycle}>
      <Text style={[styles.token, { color: token.color }]}>
        {token.text[displayMode]}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 12,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  line: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  token: {
    fontSize: 22,
    marginRight: 4,
  },
  translation: {
    fontSize: 16,
    color: "#555",
  },
});
