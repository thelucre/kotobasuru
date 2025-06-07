import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { AIFeedback } from "../components/AIFeedback";
import * as GeminiAPI from "../api/gemini";
import { useUserStore } from "../store/userStore";

interface ReplyInputProps {
  contextSentence: string;
  sceneId: string;
}

export function ReplyInput({ contextSentence, sceneId }: ReplyInputProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const logInteraction = useUserStore((state) => state.actions.logInteraction);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setFeedback(null);

    const aiFeedback = await GeminiAPI.getReplyFeedback(contextSentence, text);
    setFeedback(aiFeedback);
    setIsLoading(false);

    logInteraction({
      sceneId,
      timestamp: Date.now(),
      interactions: [], // Reply is handled separately
      userReply: text,
      aiFeedback,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Express yourself..."
        editable={!isLoading}
      />
      <Button
        title={isLoading ? "Thinking..." : "Reply"}
        onPress={handleSubmit}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator style={styles.loader} />}
      {feedback && <AIFeedback feedback={feedback} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  loader: {
    marginVertical: 12,
  },
});
