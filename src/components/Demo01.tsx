// components/Demo01.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import {
  loadUserData,
  saveUserData,
  clearUserData,
  simulateScene,
} from "../store/user";
import { type UserData, type SceneSession } from "../types";

const testSession: SceneSession = {
  sceneId: "scene001",
  timestamp: Date.now(),
  wordXPChanges: {
    tabemasu: { xp: 10, exposures: 1, guessedCorrectly: 1 },
    onigiri: { xp: 5, exposures: 1 },
  },
  notes: "User visited konbini and understood some food vocab",
};

export default function Demo01() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    loadUserData().then(setUserData);
  }, []);

  function handleSimulate() {
    if (!userData) return;
    const updated = simulateScene(userData, testSession);
    saveUserData(updated);
    setUserData(updated);
  }

  function handleClear() {
    clearUserData().then(setUserData);
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.heading}>📘 言葉する Debug Mode</Text>
      <Button title="▶️ Simulate Scene Session" onPress={handleSimulate} />
      <Button
        title="🧹 Clear User Data"
        onPress={handleClear}
        color="darkred"
      />
      {userData && (
        <View style={styles.dataBlock}>
          <Text style={styles.dataTitle}>🔤 Word XP</Text>
          {Object.entries(userData.wordXPMap).map(([wordId, xp]) => (
            <Text key={wordId}>
              {wordId}: {xp.xp} XP / {xp.exposures}x
            </Text>
          ))}
          <Text style={styles.dataTitle}>✅ Completed Scenes</Text>
          {userData.completedSceneIds.map((id) => (
            <Text key={id}>✔️ {id}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 24,
    gap: 12,
    backgroundColor: "#fdfdfd",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  dataBlock: {
    marginTop: 16,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
  },
  dataTitle: {
    fontWeight: "bold",
    marginTop: 8,
  },
});
