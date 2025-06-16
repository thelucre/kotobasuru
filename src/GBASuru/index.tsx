import React, { useRef, useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import RNFS from "react-native-fs";
import { WebView } from "react-native-webview";
import TextRecognition, {
  TextRecognitionScript,
} from "@react-native-ml-kit/text-recognition";

export default function GBASuruScreen() {
  const webviewRef = useRef<View>(null);
  const [processing, setProcessing] = useState(false);
  const [ocrResults, setOcrResults] = useState<string[]>([]);

  const handleCaptureAndOCR = async () => {
    try {
      setProcessing(true);

      if (!webviewRef.current) {
        console.warn("WebView ref not found.");
        return;
      }

      console.log("[OCR] Attempting to capture WebView...");
      const uri = await captureRef(webviewRef, {
        format: "jpg",
        quality: 0.9,
      });

      const safeUri =
        Platform.OS === "ios" && !uri.startsWith("file://")
          ? `file://${uri}`
          : uri;

      const exists = await RNFS.exists(safeUri);
      if (!exists) {
        console.warn("Image file does not exist:", safeUri);
        return;
      }

      console.log("[OCR] Running text recognition...");
      const result = await TextRecognition.recognize(
        safeUri,
        TextRecognitionScript.JAPANESE
      );

      const isJapanese = (text: string) =>
        /[\u3040-\u30FF\u4E00-\u9FFF]/.test(text); // hiragana, katakana, kanji

      const textLines: string[] = [];
      for (const block of result.blocks) {
        for (const line of block.lines) {
          if (isJapanese(line.text)) {
            textLines.push(line.text);
          }
        }
      }

      setOcrResults(textLines);
      console.log("[OCR] Found lines:", textLines);
    } catch (err: any) {
      console.error("[OCR] Error:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View ref={webviewRef} collapsable={false} style={{ flex: 1 }}>
        <WebView
          source={{ uri: "http://192.168.4.80:1337" }}
          javaScriptEnabled
          originWhitelist={["*"]}
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={processing ? "Processing..." : "Capture & OCR"}
          onPress={handleCaptureAndOCR}
          disabled={processing}
        />
      </View>

      {ocrResults.length > 0 && (
        <ScrollView
          style={styles.resultsContainer}
          contentContainerStyle={{ padding: 12 }}
        >
          {ocrResults.map((line, idx) => (
            <Text
              key={idx}
              style={{
                marginBottom: 4,
                fontFamily:
                  Platform.OS === "ios" ? "Hiragino Mincho ProN" : "sans-serif",
              }}
            >
              {line}
            </Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  resultsContainer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    maxHeight: 250,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    zIndex: 5,
    fontFamily: "Courier New monospace",
    fontSize: 10,
  },
});
