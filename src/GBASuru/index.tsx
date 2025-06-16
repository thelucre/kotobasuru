// @/GBASuru/index.tsx
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default function GBASuruScreen() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: "http://localhost:1337" }}
        javaScriptEnabled
        originWhitelist={["*"]}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}
