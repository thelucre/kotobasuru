import { create } from "zustand";
import { UserData, SceneInteractionLog } from "../types/data";
import * as StorageService from "../services/StorageService";
import * as FamiliarityService from "../services/FamiliarityService";

interface UserState {
  userData: UserData | null;
  isLoading: boolean;
  actions: {
    loadUser: () => Promise<void>;
    logInteraction: (log: SceneInteractionLog) => void;
    completeScene: (sceneId: string) => void;
    initializeUser: (name: string) => void;
  };
}

export const useUserStore = create<UserState>((set, get) => ({
  userData: null,
  isLoading: true,
  actions: {
    loadUser: async () => {
      set({ isLoading: true });
      const userData = await StorageService.loadUserData();
      set({ userData, isLoading: false });
    },
    logInteraction: (log) => {
      const { userData } = get();
      if (userData) {
        const updatedUserData = FamiliarityService.updateUserDataWithLog(
          userData,
          log
        );
        set({ userData: updatedUserData });
        StorageService.saveUserData(updatedUserData);
      }
    },
    completeScene: (sceneId) => {
      const { userData } = get();
      if (userData) {
        const updatedUserData: UserData = {
          ...userData,
          completedSceneIds: [...userData.completedSceneIds, sceneId],
          dailyRitualLog: [...userData.dailyRitualLog, Date.now()],
          lastSceneId: sceneId,
        };
        set({ userData: updatedUserData });
        StorageService.saveUserData(updatedUserData);
      }
    },
    initializeUser: (name: string) => {
      const newUser = StorageService.initializeNewUser(name);
      set({ userData: newUser, isLoading: false });
      StorageService.saveUserData(newUser);
    },
  },
}));
