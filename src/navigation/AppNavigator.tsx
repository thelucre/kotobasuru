// navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button } from "react-native";
import GBASuruScreen from "../GBASuru"; // Adjust the import path as needed

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 24 }}>
        Choose Your Adventure
      </Text>
      <Button
        title="Kotoba Suru"
        onPress={() => navigation.navigate("Kotoba")}
      />
      <Button
        title="GBA Suru"
        onPress={() => navigation.navigate("GBA SURU")}
      />
    </View>
  );
}

function KotobaSuruScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Kotoba Suru goes here.</Text>
    </View>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Kotoba" component={KotobaSuruScreen} />
        <Stack.Screen name="GBA SURU" component={GBASuruScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
