import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from "../types/data";

const USER_DATA_KEY = "KOTOBA_USER_DATA";

/**
 * Saves the user's data to AsyncStorage.
 * @param data The user data to save.
 */
export async function saveUserData(data: UserData): Promise<void> {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save user data.", e);
    // Depending on requirements, you might want to throw the error
    // or handle it in a way that the user is notified.
  }
}

/**
 * Loads the user's data from AsyncStorage.
 * @returns The user data or null if it doesn't exist.
 */
export async function loadUserData(): Promise<UserData | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Failed to load user data.", e);
    return null;
  }
}

/**
 * Creates a new user object with default values.
 * @param name The user's name.
 * @returns A new UserData object.
 */
export function initializeNewUser(name: string): UserData {
  return {
    id: `user_${Date.now()}`, // Simple unique ID
    name,
    createdAt: Date.now(),
    wordStats: {},
    completedSceneIds: [],
    dailyRitualLog: [],
  };
}
