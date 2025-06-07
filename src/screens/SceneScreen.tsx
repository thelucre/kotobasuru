import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Scene as SceneType, SceneInteractionLog } from "../types/data";
import { Sentence } from "../components/Sentence";
import { ReplyInput } from "../components/ReplyInput";
// Mock data - replace with actual data loading
import { scenes } from "../data/scenes/konbini";

type Props = NativeStackScreenProps<RootStackParamList, "Scene">;

export function SceneScreen({ route, navigation }: Props) {
  const { sceneId } = route.params;
  const [currentScene, setCurrentScene] = useState<SceneType | null>(null);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [interactionLog, setInteractionLog] =
    useState<SceneInteractionLog | null>(null);

  useEffect(() => {
    // Find the scene from mock data
    const scene = scenes.find((s) => s.id === sceneId);
    if (scene) {
      setCurrentScene(scene);
      setInteractionLog({
        sceneId: scene.id,
        timestamp: Date.now(),
        interactions: [],
      });
    }
  }, [sceneId]);

  const handleNext = () => {
    if (currentScene && sentenceIndex < currentScene.lines.length - 1) {
      setSentenceIndex(sentenceIndex + 1);
    } else {
      // Navigate to reflection screen
      navigation.navigate("Reflection", { log: interactionLog });
    }
  };

  if (!currentScene) {
    return (
      <View style={styles.container}>
        <Text>Loading scene...</Text>
      </View>
    );
  }

  const currentSentence = currentScene.lines[sentenceIndex];

  return (
    <ImageBackground
      source={{ uri: "https://placekitten.com/900/600" }} // Placeholder image
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>{currentScene.title}</Text>
        <Sentence sentence={currentSentence} />
        <ReplyInput
          contextSentence={currentSentence}
          sceneId={currentScene.id}
        />
        <Button title="Next" onPress={handleNext} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
});
