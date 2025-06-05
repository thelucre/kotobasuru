// src/App.tsx
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import SentenceRenderer from "@/components/SentenceRenderer/SentenceRenderer";

const demoSentences = [
  "コンビニでおにぎりを買いました。",
  "お金がないので、ジュースを買いませんでした。",
  "雨が降っているから、コンビニまで走りました。",
];

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Japanese Sentence Parser</Text>
      {demoSentences.map((sentence, index) => (
        <SentenceRenderer key={index} sentence={sentence} />
      ))}
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
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
