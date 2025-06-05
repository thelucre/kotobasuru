// src/screens/KonbiniSentences.tsx
import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import { SentenceRenderer } from "@/components/SentenceRenderer";
import { konbiniSentences } from "@/data/sentences/konbini";

export default function KonbiniSentences() {
  const [index, setIndex] = useState(0);
  const sentence = konbiniSentences[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % konbiniSentences.length);
  };

  return (
    <View style={styles.container}>
      <SentenceRenderer
        sentence={
          "朝寝坊したので、急いでコンビニで朝ごはんを買わなければなりませんでした。"
        }
      />
      <Button title="Next Sentence" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
  },
});
