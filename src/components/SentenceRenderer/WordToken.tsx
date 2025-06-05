// src/components/WordToken.tsx
import { useState } from "react";
import { Text, Pressable, StyleSheet, View } from "react-native";
import type { WordTokenData } from "@/types/sentence";

type Props = {
  token: WordTokenData;
};

export function WordToken({ token }: Props) {
  const [mode, setMode] = useState<"kanji" | "kana" | "romaji">("kanji");

  const toggleMode = () => {
    setMode((prev) =>
      prev === "kanji" ? "kana" : prev === "kana" ? "romaji" : "kanji"
    );
  };

  return (
    <Pressable onPress={toggleMode}>
      <View style={styles.token}>
        <Text style={styles.text}>{token.text[mode]}</Text>
        <Text style={styles.xp}>{token.xp ?? 0} XP</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  token: {
    alignItems: "center",
    padding: 4,
    margin: 2,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
  text: {
    fontSize: 18,
  },
  xp: {
    fontSize: 12,
    color: "#888",
  },
});
