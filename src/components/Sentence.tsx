import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Token, WordStats } from "../types/data";
import { TappableWord } from "./TappableWord";
import * as JapaneseParserService from "../services/JapaneseParserService";
import { useUserStore } from "../store/userStore";

interface SentenceProps {
  sentence: string;
}

export function Sentence({ sentence }: SentenceProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const wordStats = useUserStore((state) => state.userData?.wordStats);

  useEffect(() => {
    const processSentence = async () => {
      const tokenized = await JapaneseParserService.tokenize(sentence);
      setTokens(tokenized);
    };
    processSentence();
  }, [sentence]);

  if (!wordStats) {
    return null; // Or a loading indicator
  }

  return (
    <View style={styles.sentenceContainer}>
      {tokens.map((token, index) => {
        const stats = wordStats[token.basic_form] || {
          wordId: token.basic_form,
          familiarity: 0,
          exposures: 0,
          interactions: 0,
          lastSeen: 0,
        };
        return <TappableWord key={index} token={token} stats={stats} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sentenceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 16,
  },
});
