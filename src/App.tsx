// src/App.tsx
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useState } from "react";

import Demo01 from "./components/Demo01";
import MapView from "./ui/Map/MapView";

// Stores
import { setLastLocation, getLastLocation } from "@/store/user";
import DemoSentence from "./components/SentenceRenderer/DemoSentence";

export default function App() {
  const [activeView, setActiveView] = useState<"map" | "demo">("map");

  return (
    <View style={styles.container}>
      <DemoSentence />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
  },
});
