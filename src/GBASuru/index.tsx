import React, { useRef, useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import type { WebView as WebViewType } from "react-native-webview";
import RNFS from "react-native-fs";
import TextRecognition, {
  TextRecognitionScript,
} from "@react-native-ml-kit/text-recognition";

// Hooks
import { useLocalGbaServer } from "./hooks/useLocalGbaServer";

export default function GBASuruScreen() {
  const webviewRef = useRef<WebViewType>(null);
  const [processing, setProcessing] = useState(false);
  const [ocrResults, setOcrResults] = useState<string[]>([]);
  const serverUrl = useLocalGbaServer();

  const isJapanese = (text: string) =>
    /[\u3040-\u30FF\u4E00-\u9FFF]/.test(text); // hiragana, katakana, kanji

  const handleBase64OCR = async (dataUrl: string) => {
    console.log(
      "[OCR] Raw data URL received (truncated):",
      dataUrl.slice(0, 50)
    );

    const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
    console.log("[OCR] Cleaned base64 length:", base64.length);

    const filePath = `${RNFS.CachesDirectoryPath}/screenshot.jpg`;

    try {
      setProcessing(true);
      console.log("[OCR] Writing base64 image to:", filePath);

      await RNFS.writeFile(filePath, base64, "base64");
      const exists = await RNFS.exists(filePath);
      console.log("[OCR] File exists:", exists);

      if (!exists) {
        console.warn("[OCR] File write failed.");
        return;
      }

      console.log("[OCR] Running TextRecognition...");
      const result = await TextRecognition.recognize(
        `file://${filePath}`,
        TextRecognitionScript.JAPANESE
      );

      const textLines: string[] = [];
      for (const block of result.blocks) {
        for (const line of block.lines) {
          console.log("[OCR] → Line:", line.text);
          if (isJapanese(line.text)) {
            textLines.push(line.text);
          }
        }
      }

      console.log("[OCR] Japanese lines:", textLines);
      setOcrResults(textLines);

      // Delete image
      if (await RNFS.exists(filePath)) {
        await RNFS.unlink(filePath);
        console.log("[OCR] Deleted temporary image:", filePath);
      }
    } catch (err) {
      console.error("[OCR] Caught exception:", err);
    } finally {
      setProcessing(false);
      console.log("[OCR] Finished processing.");
    }
  };

  const handleMessage = (event) => {
    console.log(event);
    try {
      const { type, payload } = JSON.parse(event.nativeEvent.data);
      if (type === "screenshot" && typeof payload === "string") {
        console.log("📸 Screenshot received, running OCR...");
        handleBase64OCR(payload);
      }
    } catch (err) {
      console.error("Invalid message from WebView:", err);
    }
  };

  const handleCaptureAndOCR = () => {
    webviewRef.current?.injectJavaScript(`sendScreenshotToReactNative();`);
  };

  console.log("[GBASuru] !!!!Server URL:", serverUrl);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {serverUrl && (
          <WebView
            ref={webviewRef}
            // source={{ uri: "http://192.168.4.80:1337" }}
            source={{
              uri: serverUrl.replace("localhost", "127.0.0.1") + "/index.html",
              // uri: "http://192.168.4.80:1337/index.html",
            }}
            style={styles.emulatorContainer}
            javaScriptEnabled
            originWhitelist={["*"]}
            allowsFullscreenVideo
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            onMessage={handleMessage}
            onLoadStart={() => console.log("WebView starting load")}
            onLoadEnd={() => console.log("WebView finished load")}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error("WebView error: ", nativeEvent);
            }}
          />
        )}
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
  emulatorContainer: {
    // opacity: 0.5,
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
    zIndex: 50,
    fontFamily: "Courier New monospace",
    fontSize: 10,
  },
});
