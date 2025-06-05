// src/screens/KonbiniSentences.tsx
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SentenceRenderer } from "@/components/SentenceRenderer";
import { konbiniSentences } from "@/data/packs/konbini";

export default function KonbiniSentences() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {konbiniSentences.map((sentence, idx) => (
        <View key={sentence.id} style={styles.sentenceBlock}>
          <SentenceRenderer sentence={sentence.text} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
  },
  sentenceBlock: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
});
