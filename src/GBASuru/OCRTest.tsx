import React, { useState } from "react";
import { View, Text, Button, Image, Platform } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import TextRecognition, {
  TextRecognitionScript,
} from "@react-native-ml-kit/text-recognition";

export default function OCRTestScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [textBlocks, setTextBlocks] = useState<string[]>([]);

  const handlePick = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    setImageUri(uri);

    try {
      const res = await TextRecognition.recognize(
        uri,
        TextRecognitionScript.JAPANESE
      );
      const rawText = res.blocks.map((b) => b.text);

      setTextBlocks(rawText);

      const cleanedText = rawText.map((text) =>
        text.replace(
          /[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\p{Script=Latin}\s]/gu,
          ""
        )
      );
      console.log("🧼 Cleaned Text:", cleanedText);

      for (let block of res.blocks) {
        console.log("Block text:", block.text);
        console.log("Block frame:", block.frame);

        for (let line of block.lines) {
          console.log("Line text:", line.text);
          console.log("Line frame:", line.frame);
        }
      }
    } catch (e) {
      console.error("❌ OCR failed", e);
      setTextBlocks(["OCR failed"]);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Button title="Pick Image" onPress={handlePick} />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginVertical: 16 }}
          resizeMode="contain"
        />
      )}
      {textBlocks.map((t, i) => (
        <Text
          key={i}
          style={{
            fontFamily:
              Platform.OS === "ios" ? "Hiragino Mincho ProN" : "sans-serif",
            fontSize: 16,
            marginBottom: 4,
          }}
        >
          {t}
        </Text>
      ))}
    </View>
  );
}
