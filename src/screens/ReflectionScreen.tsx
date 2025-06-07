import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { SceneInteractionLog, WordStats } from "../types/data";
import { useUserStore } from "../store/userStore";

type Props = NativeStackScreenProps<RootStackParamList, "Reflection">;

export function ReflectionScreen({ route, navigation }: Props) {
  const { log } = route.params;
  const { userData } = useUserStore();

  if (!log || !userData) {
    return (
      <View style={styles.container}>
        <Text>No reflection data available.</Text>
      </View>
    );
  }

  const getWordList = (
    title: string,
    filter: (stats: WordStats) => boolean
  ) => {
    const words = Object.values(userData.wordStats)
      .filter(filter)
      .map((stats) => stats.wordId); // In a real app, you'd look up the word details

    if (words.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {words.map((word) => (
          <Text key={word} style={styles.wordText}>
            {word}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Footprints</Text>
      <Text style={styles.subHeader}>今日の足跡 - Kyou no Ashi跡</Text>

      {getWordList("New Words Encountered", (stats) => stats.familiarity < 0.3)}
      {getWordList(
        "Words You're Getting Closer To",
        (stats) => stats.familiarity >= 0.3 && stats.familiarity < 0.8
      )}

      {log.userReply && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Expression</Text>
          <Text style={styles.replyText}>You said: "{log.userReply}"</Text>
          <Text style={styles.feedbackText}>Feedback: "{log.aiFeedback}"</Text>
        </View>
      )}

      <Text style={styles.progressMessage}>
        You were here. That is progress.
      </Text>

      <Button
        title="Return to Journey"
        onPress={() => navigation.navigate("Scene", { sceneId: "konbini_1" })} // Go back to a default scene
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
  },
  subHeader: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  wordText: {
    fontSize: 16,
    marginBottom: 5,
  },
  replyText: {
    fontSize: 16,
    fontStyle: "italic",
  },
  feedbackText: {
    fontSize: 16,
    marginTop: 5,
  },
  progressMessage: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginVertical: 30,
  },
});
