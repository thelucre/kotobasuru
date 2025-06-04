// src/data/userStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { applySceneSession, type UserData, type SceneSession } from "../types";

const STORAGE_KEY = "userData";

const initialUserData: UserData = {
  wordXPMap: {},
  unlockedLocationIds: ["konbini"],
  completedSceneIds: [],
};

export async function loadUserData(): Promise<UserData> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : initialUserData;
}

export async function saveUserData(data: UserData) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function clearUserData(): Promise<UserData> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return initialUserData;
}

export function simulateScene(
  userData: UserData,
  session: SceneSession
): UserData {
  return applySceneSession(userData, session);
}
