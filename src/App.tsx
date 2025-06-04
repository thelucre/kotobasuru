// src/App.tsx
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useState } from "react";

import Demo01 from "./components/Demo01";
import MapView from "./ui/Map/MapView";

export default function App() {
  const [activeView, setActiveView] = useState<"map" | "demo">("map");

  return (
    <View style={styles.container}>
      {activeView === "map" ? (
        <MapView onLocationSelect={() => setActiveView("demo")} />
      ) : (
        <Demo01 />
      )}
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
