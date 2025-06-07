import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoadingScreen } from "../screens/LoadingScreen";
import { SceneScreen } from "../screens/SceneScreen";
import { ReflectionScreen } from "../screens/ReflectionScreen";

export type RootStackParamList = {
  Loading: undefined;
  Scene: { sceneId: string };
  Reflection: { log: any }; // Replace 'any' with SceneInteractionLog
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Scene" component={SceneScreen} />
        <Stack.Screen name="Reflection" component={ReflectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
