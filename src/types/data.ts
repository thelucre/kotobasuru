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

/** Represents a user's entire learning state. */
export interface UserData {
  id: string;
  name: string;
  createdAt: number; // epoch ms
  // Replaces WordXP with a more descriptive name and includes familiarity.
  wordStats: Record<WordId, WordStats>;
  // Tracks user's progress through scenes.
  completedSceneIds: SceneId[];
  // Logs daily presence, the core metric of the app.
  dailyRitualLog: number[]; // Array of epoch ms timestamps for each day the user showed up.
  lastSceneId?: SceneId; // Remembers where the user left off.
}

/**
 * Tracks the user's relationship with a single word.
 * This directly maps to your "Build a relationship to words" principle.
 * 'Familiarity' is the core metric for adapting the UI.
 */
export interface WordStats {
  wordId: WordId;
  familiarity: number; // 1.0 (fully known) down to 0.0 (brand new). Starts at 0.
  exposures: number; // How many times has the user seen this word?
  interactions: number; // How many times has the user tapped this word?
  lastSeen: number; // epoch ms
}

/** A log of a single interaction within a scene. */
export interface SceneInteractionLog {
  sceneId: SceneId;
  timestamp: number;
  interactions: {
    wordId: WordId;
    action:
      | "expose"
      | "tap_reveal_kana"
      | "tap_reveal_meaning"
      | "reply_attempt";
  }[];
  userReply?: string;
  aiFeedback?: string;
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
  wordXPChanges: Record<WordId, Partial<WordStats>>;
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
