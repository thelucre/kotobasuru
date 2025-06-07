import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface AIFeedbackProps {
  feedback: string;
}

export function AIFeedback({ feedback }: AIFeedbackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kotoba Sensei says:</Text>
      <Text style={styles.feedbackText}>{feedback}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#eef6ff",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1e40af",
  },
  feedbackText: {
    fontSize: 16,
    color: "#1e3a8a",
  },
});
