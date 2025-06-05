// Types for core learning system

export type WordId = string;
export type LocationId = string;
export type SceneId = string;

export interface WordEntry {
  id: WordId;
  kana: string;
  kanji?: string;
  meaning: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "particle" | "expression";
  tags?: string[]; // e.g., ["konbini", "food", "basic"]
  jlpt?: "N5" | "N4" | "N3" | "N2" | "N1";
}

export interface WordXP {
  wordId: WordId;
  xp: number;
  exposures: number;
  lastSeen: number; // epoch ms
  guessedCorrectly: number;
  guessedIncorrectly: number;
  notes?: string;
}

export interface ContentPack {
  locationId: LocationId;
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  wordIds: WordId[];
  grammarPoints: GrammarPoint[];
  scenes: Scene[];
}

export interface ContentRegistry {
  packs: Record<string, ContentPack>; // key = `${locationId}.${level}`
  knownWordIds: Set<WordId>;
  knownGrammarIds: Set<string>;
}

export interface GrammarPoint {
  id: string;
  expression: string;
  meaning: string;
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  examples?: string[];
}

export interface Scene {
  id: SceneId;
  locationId: LocationId;
  title: string;
  lines: string[]; // Japanese sentences
  wordIds: WordId[]; // used in this scene
}

export interface Location {
  id: LocationId;
  name: string; // Display name with romaji or English
  description?: string;
  sceneIds: SceneId[];
  english: string;
  romaji: string;
  furigana: string;
  kanji: string;
  icon?: string; // Placeholder for icon reference
}

// Example: Scene processor result
export interface SceneSession {
  sceneId: SceneId;
  timestamp: number;
  wordXPChanges: Record<WordId, Partial<WordXP>>;
  notes?: string;
}

// Token as returned by kuromoji tokenizer
export type Token = {
  surface_form: string;
  pos: string;
  pos_detail_1: string;
  pos_detail_2: string;
  pos_detail_3: string;
  conjugated_type: string;
  conjugated_form: string;
  basic_form: string;
  reading: string;
  pronunciation: string;
};

// A single step in a grammar pattern match
export type GrammarRuleStep = {
  pos?: string;
  basic_form?: string;
  surface_form?: string;
  conjugated_form?: string;
  exact?: boolean; // all fields must match exactly
};

/**
 * A structured object for grammar rule explanations, designed for rich display.
 * This replaces the simple `explanation` string.
 */
export interface GrammarNote {
  title: string; // A short, clear title (e.g., "Past Polite Verb")
  structure: string; // The grammatical formula (e.g., "Verb Stem + ました")
  summary: string; // A paragraph explaining the rule's usage and nuance.
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  examples?: string[]; // Optional: Example sentences demonstrating the rule.
  related?: string[]; // Optional: IDs of related grammar rules (e.g., V-MASU -> V-MASHITA).
}

// A full grammar rule with metadata
export interface GrammarRule {
  id: string;
  match: GrammarRuleStep[];
  notes: GrammarNote;
}

// A match result
export type GrammarMatch = {
  ruleId: string;
  start: number;
  end: number;
  matchedTokens: Token[];
};

// Utility: Calculate difficulty of a scene for a user
export function calculateSceneDifficulty(
  scene: Scene,
  userData: UserData
): number {
  let totalXP = 0;
  for (const wordId of scene.wordIds) {
    const xp = userData.wordXPMap[wordId]?.xp ?? 0;
    totalXP += xp;
  }
  const avgXP = totalXP / scene.wordIds.length;
  return Math.round(100 - avgXP); // lower XP → higher difficulty
}

// Utility: Apply XP changes
export function applySceneSession(
  userData: UserData,
  session: SceneSession
): UserData {
  const updated = { ...userData, wordXPMap: { ...userData.wordXPMap } };
  for (const [wordId, delta] of Object.entries(session.wordXPChanges)) {
    const prev = updated.wordXPMap[wordId] ?? {
      wordId,
      xp: 0,
      exposures: 0,
      lastSeen: 0,
      guessedCorrectly: 0,
      guessedIncorrectly: 0,
    };
    updated.wordXPMap[wordId] = {
      ...prev,
      ...delta,
      xp: prev.xp + (delta.xp ?? 0),
      exposures: prev.exposures + (delta.exposures ?? 0),
      guessedCorrectly: prev.guessedCorrectly + (delta.guessedCorrectly ?? 0),
      guessedIncorrectly:
        prev.guessedIncorrectly + (delta.guessedIncorrectly ?? 0),
      lastSeen: session.timestamp,
    };
  }
  updated.completedSceneIds.push(session.sceneId);
  return updated;
}
