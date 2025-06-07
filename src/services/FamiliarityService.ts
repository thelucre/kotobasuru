import { UserData, WordStats, SceneInteractionLog } from "../types/data";

/**
 * Processes a single user interaction and updates the word stats accordingly.
 *
 * @param stats The current stats for the word.
 * @param action The action the user took.
 * @returns The updated word stats.
 */
export function processInteraction(
  stats: WordStats,
  action: "expose" | "tap_reveal_kana" | "tap_reveal_meaning"
): WordStats {
  const newStats = { ...stats };
  newStats.lastSeen = Date.now();

  switch (action) {
    case "expose":
      newStats.exposures++;
      newStats.familiarity = Math.min(1.0, newStats.familiarity + 0.01);
      break;
    case "tap_reveal_kana":
      newStats.interactions++;
      newStats.familiarity = Math.max(0.0, newStats.familiarity - 0.1);
      break;
    case "tap_reveal_meaning":
      newStats.interactions++;
      newStats.familiarity = Math.max(0.0, newStats.familiarity - 0.2);
      break;
  }

  return newStats;
}

/**
 * Updates the user data based on a log of interactions from a scene.
 *
 * @param userData The user's current data.
 * @param log The log of interactions from the scene.
 * @returns The updated user data.
 */
export function updateUserDataWithLog(
  userData: UserData,
  log: SceneInteractionLog
): UserData {
  const updatedUserData = {
    ...userData,
    wordStats: { ...userData.wordStats },
  };

  log.interactions.forEach((interaction) => {
    if (interaction.action !== "reply_attempt") {
      const currentStats = updatedUserData.wordStats[interaction.wordId] || {
        wordId: interaction.wordId,
        familiarity: 0,
        exposures: 0,
        interactions: 0,
        lastSeen: 0,
      };
      updatedUserData.wordStats[interaction.wordId] = processInteraction(
        currentStats,
        interaction.action
      );
    }
  });

  return updatedUserData;
}
