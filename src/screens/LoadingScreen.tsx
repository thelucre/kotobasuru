import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import { useUserStore } from "../store/userStore";
import { useJapaneseTokenizer } from "../hooks/useJapaneseTokenizer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Loading">;

export function LoadingScreen({ navigation }: Props) {
  const { userData, isLoading, actions } = useUserStore();
  const { isInitialized: isTokenizerInitialized } = useJapaneseTokenizer();
  const [name, setName] = React.useState("");

  useEffect(() => {
    actions.loadUser();
  }, []);

  useEffect(() => {
    if (!isLoading && isTokenizerInitialized) {
      if (userData) {
        const lastScene = userData.lastSceneId || "konbini_1"; // Default scene
        navigation.replace("Scene", { sceneId: lastScene });
      }
      // If no user data, we wait for the user to input their name.
    }
  }, [isLoading, isTokenizerInitialized, userData, navigation, actions]);

  const handleInitializeUser = () => {
    if (name.trim()) {
      actions.initializeUser(name.trim());
    }
  };

  if (isLoading || !isTokenizerInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading your journey...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to KOTOBA SURU</Text>
        <TextInput
          style={styles.input}
          placeholder="What should we call you?"
          value={name}
          onChangeText={setName}
        />
        <Button title="Begin" onPress={handleInitializeUser} />
      </View>
    );
  }

  // This state should be brief as the useEffect will navigate away.
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
});
