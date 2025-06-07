import React, { useState, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Token, WordStats } from "../types/data";
import { useUserStore } from "../store/userStore";

interface TappableWordProps {
  token: Token;
  stats: WordStats;
}

type DisplayLevel = "kanji" | "kana" | "meaning";

export function TappableWord({ token, stats }: TappableWordProps) {
  const [displayLevel, setDisplayLevel] = useState<DisplayLevel>("kanji");
  const logInteraction = useUserStore((state) => state.actions.logInteraction);

  useEffect(() => {
    // Set initial display level based on familiarity
    if (stats.familiarity > 0.8) {
      setDisplayLevel("kanji");
    } else if (stats.familiarity > 0.4) {
      setDisplayLevel("kana");
    } else {
      setDisplayLevel("kana"); // Default to kana with underline
    }
  }, [stats.familiarity]);

  const handlePress = () => {
    let action: "tap_reveal_kana" | "tap_reveal_meaning";
    let nextLevel: DisplayLevel;

    if (displayLevel === "kanji") {
      nextLevel = "kana";
      action = "tap_reveal_kana";
    } else if (displayLevel === "kana") {
      nextLevel = "meaning";
      action = "tap_reveal_meaning";
    } else {
      nextLevel = "kanji"; // Cycle back to kanji
      // No interaction to log here as we are hiding info
      setDisplayLevel(nextLevel);
      return;
    }

    logInteraction({
      sceneId: "", // This needs to be passed down from the scene
      timestamp: Date.now(),
      interactions: [{ wordId: stats.wordId, action }],
    });
    setDisplayLevel(nextLevel);
  };

  const getDisplayText = () => {
    switch (displayLevel) {
      case "kanji":
        return token.surface_form;
      case "kana":
        return token.reading;
      case "meaning":
        // This is a placeholder. In a real app, you'd get this from your word data.
        return "meaning";
      default:
        return token.surface_form;
    }
  };

  const isNew = stats.familiarity <= 0.4 && displayLevel === "kana";

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[styles.word, isNew && styles.newWord]}>
        {getDisplayText()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  word: {
    fontSize: 24,
    marginHorizontal: 2,
    padding: 4,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  newWord: {
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
  },
});
