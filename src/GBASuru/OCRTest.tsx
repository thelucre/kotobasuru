import React, { useState } from "react";
import { View, Text, Button, Image, ScrollView, Platform } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import TextRecognition, {
  TextRecognitionScript,
} from "@react-native-ml-kit/text-recognition";

export default function OCRTestScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<any[]>([]);

  const handlePick = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    setImageUri(uri);
    const res = await TextRecognition.recognize(
      uri,
      TextRecognitionScript.JAPANESE
    );
    setBlocks(res.blocks);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 24 }}>
      <Button title="Pick Image" onPress={handlePick} />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", height: 200, marginVertical: 16 }}
          resizeMode="contain"
        />
      )}
      {blocks.map((block, i) => (
        <TextBlock
          key={i}
          text={block.text}
          frame={block.frame}
          lines={block.lines}
        />
      ))}
    </ScrollView>
  );
}

function TextBlock({
  text,
  frame,
  lines,
}: {
  text: string;
  frame: any;
  lines: { text: string; frame: any }[];
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 14 }}>🧱 Block</Text>
      <Text
        style={{
          fontFamily:
            Platform.OS === "ios" ? "Hiragino Mincho ProN" : "sans-serif",
        }}
      >
        {text}
      </Text>
      <Text style={{ fontSize: 12, color: "#888" }}>
        Frame: {JSON.stringify(frame)}
      </Text>
      {lines.map((line, i) => (
        <TextLine key={i} text={line.text} frame={line.frame} />
      ))}
    </View>
  );
}

function TextLine({ text, frame }: { text: string; frame: any }) {
  return (
    <View style={{ marginTop: 4, marginLeft: 8 }}>
      <Text
        style={{
          fontSize: 16,
          fontFamily:
            Platform.OS === "ios" ? "Hiragino Mincho ProN" : "sans-serif",
        }}
      >
        {text}
      </Text>
      <Text style={{ fontSize: 12, color: "#aaa" }}>
        ↳ Frame: {JSON.stringify(frame)}
      </Text>
    </View>
  );
}
