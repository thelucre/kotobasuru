import React, { useState } from "react";
import { View, Text, Button, Image, Platform } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import MlkitOcr from "react-native-mlkit-ocr";

export default function OCRTestScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [textBlocks, setTextBlocks] = useState<string[]>([]);

  const handlePick = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    setImageUri(uri);
    const blocks = await MlkitOcr.detectFromUri(uri);
    setTextBlocks(blocks.map((b) => b.text));

    const cleanedText = blocks.map((b) =>
      b.text.replace(
        /[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\p{Script=Latin}\s]/gu,
        ""
      )
    );
    console.log(cleanedText);
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
          style={{
            fontFamily:
              Platform.OS === "ios" ? "Hiragino Mincho ProN" : "sans-serif",
            fontSize: 16,
          }}
        >
          {t}
        </Text>
      ))}
    </View>
  );
}
