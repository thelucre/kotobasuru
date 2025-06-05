import { useState } from "react";
import { Text, Pressable, StyleSheet, View } from "react-native";
import { type IpadicFeatures } from "@sglkc/kuromoji";
import { toHiragana } from "wanakana";

interface Props {
  token: IpadicFeatures;
  isMatched?: boolean;
  matchId?: string;
}

export function SingleWord({ token, isMatched, matchId }: Props) {
  const [mode, setMode] = useState<"surface" | "kana" | "romaji">("surface");

  const toggle = () => {
    setMode((prev) =>
      prev === "surface" ? "kana" : prev === "kana" ? "romaji" : "surface"
    );
  };

  const kana = token.reading ? toHiragana(token.reading) : token.surface_form;

  const displayText =
    mode === "surface"
      ? token.surface_form
      : mode === "kana"
      ? kana
      : token.pronunciation?.toLowerCase() ?? token.surface_form;

  const getStyleByPOS = () => {
    const pos = token.pos || "";
    if (pos.includes("動詞")) return styles.verb;
    if (pos.includes("名詞")) return styles.noun;
    if (pos.includes("助詞")) return styles.particle;
    if (pos.includes("形容詞")) return styles.adjective;
    return styles.default;
  };

  return (
    <Pressable onPress={toggle}>
      <View style={[styles.wrapper, isMatched && styles.matchHighlight]}>
        <Text style={[styles.word, getStyleByPOS()]}>{displayText}</Text>
        {isMatched && matchId && <Text style={styles.matchId}>{matchId}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 6,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    padding: 2,
    // userSelect: "none",
  },
  word: {
    fontSize: 28,
    fontWeight: "500",
  },
  matchId: {
    fontSize: 10,
    color: "#4caf50",
    marginTop: 2,
  },
  matchHighlight: {
    backgroundColor: "#e0f2f1", // teal-ish highlight
  },
  verb: {
    color: "#32CD32", // lime
  },
  noun: {
    color: "#D32F2F", // red
  },
  particle: {
    color: "#FA8072", // salmon
  },
  adjective: {
    color: "#1976D2", // blue
  },
  default: {
    color: "#222",
  },
});
