// src/store/user.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  applySceneSession,
  type LocationId,
  type WordId,
  type SceneSession,
  type SceneId,
  type WordXP,
} from "../types";

const STORAGE_KEY = "userData";

export interface UserData {
  wordXPMap: Record<WordId, WordXP>;
  unlockedLocationIds: LocationId[];
  completedSceneIds: SceneId[];
  lastLocationId: LocationId | null;
}

const initialUserData: UserData = {
  wordXPMap: {},
  unlockedLocationIds: ["konbini"],
  completedSceneIds: [],
  lastLocationId: null,
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

export async function setLastLocation(locationId: string) {
  const data = await loadUserData();
  data.lastLocationId = locationId;
  await saveUserData(data);
}

export async function getLastLocation(): Promise<string | null> {
  const data = await loadUserData();
  return data.lastLocationId;
}
