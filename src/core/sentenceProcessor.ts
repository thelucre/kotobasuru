// src/core/sentenceProcessor.ts

import { Token, GrammarRule, GrammarRuleStep, GrammarMatch } from "@/types";

/**
 * A comprehensive list of grammar rules targeting JLPT N5.
 *
 * How to read the `match` array:
 * Each object represents a token that must appear in sequence.
 * - `pos`: Part of Speech (e.g., '動詞' for Verb, '助動詞' for Auxiliary Verb).
 * - `basic_form`: The dictionary form of the token (e.g., 'ます' for 'まし').
 * - `surface_form`: The actual text of the token as it appears in the sentence.
 *
 * Rules are ordered from most specific to most general where there might be overlaps.
 * For example, "V-TE-KUDASAI" is listed before "V-TE" to ensure the longer pattern is matched first.
 */
export const GRAMMAR_RULES: GrammarRule[] = [
  // ======================================================
  // === VERB CONJUGATIONS (POLITE) =======================
  // ======================================================
  {
    id: "V-MASEN-DESHITA",
    notes: {
      title: "Past Negative Polite Verb",
      structure: "Verb Stem + ませんでした",
      summary:
        "Expresses an action that did not happen in the past, in a polite context. The polite equivalent of ～なかった.",
      level: "N5",
    },
    match: [
      { pos: "動詞" },
      { basic_form: "ます", surface_form: "ませ" },
      { surface_form: "ん" },
      { basic_form: "だ", surface_form: "でし" },
      { basic_form: "た", surface_form: "た" },
    ],
  },
  {
    id: "V-MASHITA",
    notes: {
      title: "Past Polite Verb",
      structure: "Verb Stem + ました",
      summary:
        "Expresses an action that was completed in the past, in a polite context. The polite equivalent of ～た.",
      level: "N5",
    },
    match: [
      { pos: "動詞" },
      { basic_form: "ます", surface_form: "まし" },
      { basic_form: "た" },
    ],
  },
  {
    id: "V-MASEN",
    notes: {
      title: "Present Negative Polite Verb",
      structure: "Verb Stem + ません",
      summary:
        "Expresses an action that does not happen or will not happen, in a polite context. The polite equivalent of ～ない.",
      level: "N5",
    },
    match: [
      { pos: "動詞" },
      { basic_form: "ます", surface_form: "ませ" },
      { surface_form: "ん" },
    ],
  },
  {
    id: "V-MASU",
    notes: {
      title: "Present Polite Verb",
      structure: "Verb Stem + ます",
      summary:
        "Expresses a future action or a habitual action, in a polite context. The polite equivalent of the dictionary form.",
      level: "N5",
    },
    match: [{ pos: "動詞" }, { basic_form: "ます", surface_form: "ます" }],
  },
  {
    id: "V-MASHOO",
    notes: {
      title: "Volitional Polite Verb ('Let's...')",
      structure: "Verb Stem + ましょう",
      summary:
        "Used to suggest an action to a listener, translating to 'Let's (do)...'.",
      level: "N5",
    },
    match: [
      { pos: "動詞" },
      { basic_form: "ます", surface_form: "まし" },
      { basic_form: "う", surface_form: "ょ" }, // Sometimes tokenized as two parts
    ],
  },

  // ======================================================
  // === VERB CONJUGATIONS (OTHER FORMS) ==================
  // ======================================================
  {
    id: "V-TE-KUDASAI",
    notes: {
      title: "Making a Request",
      structure: "Verb て-form + ください",
      summary: "Used to make a polite request, equivalent to 'Please (do)...'.",
      level: "N5",
    },
    match: [
      { pos: "動詞" }, // e.g., 食べ
      { pos: "助詞", basic_form: "て" }, // て or で
      { pos: "動詞", basic_form: "くださる" }, // ください
    ],
  },
  {
    id: "V-TE-IMASU",
    notes: {
      title: "Continuous Action ('-ing')",
      structure: "Verb て-form + います",
      summary:
        "Expresses an ongoing action (e.g., 'I am eating') or a continuous state (e.g., 'I am married').",
      level: "N5",
    },
    match: [
      { pos: "動詞" }, // e.g., 食べ
      { pos: "助詞", basic_form: "て" }, // て or で
      { pos: "動詞", basic_form: "いる" }, // います or いる
    ],
  },
  {
    id: "V-TE",
    notes: {
      title: "Verb て-form (Joining Clauses)",
      structure: "Verb て-form",
      summary:
        "A crucial verb form used to connect multiple actions in a sequence ('I did X and then Y'), give reasons, or as part of many other grammar patterns.",
      level: "N5",
    },
    match: [
      { pos: "動詞" },
      { pos: "助詞", basic_form: "て" }, // Catches both て and で
    ],
  },
  {
    id: "V-TAI",
    notes: {
      title: "Expressing Desire ('Want to...')",
      structure: "Verb Stem + たい",
      summary:
        "Attaches to the verb stem to express the speaker's desire to do something. It conjugates like an い-adjective.",
      level: "N5",
    },
    match: [
      { pos: "動詞" },
      { basic_form: "たい" }, // たい, たく, etc.
    ],
  },
  {
    id: "V-NAI",
    notes: {
      title: "Plain Negative Verb ('-nai' form)",
      structure: "Verb ない-form",
      summary:
        "The plain, or dictionary, negative form of a verb. Used in casual speech and as a component of other grammar patterns.",
      level: "N5",
    },
    match: [{ pos: "動詞" }, { basic_form: "ない" }],
  },
  {
    id: "V-PURPOSE-NI-IKU",
    notes: {
      title: "Purpose of Movement",
      structure: "Verb Stem + に + 行く/来る/帰る",
      summary:
        "Indicates the purpose for going to, coming from, or returning to a place. E.g., 映画を見に行く (I'm going to see a movie).",
      level: "N5",
    },
    match: [
      { pos: "動詞" }, // e.g., 買い
      { pos: "助詞", surface_form: "に" },
      { pos: "動詞", basic_form: "行く" }, // or 来る, 帰る
    ],
  },

  // ======================================================
  // === I-ADJECTIVE CONJUGATIONS =========================
  // ======================================================
  {
    id: "I-ADJ-KUNAKATTA",
    notes: {
      title: "Past Negative い-Adjective",
      structure: "(Stem) + くなかった",
      summary:
        "The past negative form of an い-adjective. E.g., 'takakunatta' (it was not expensive).",
      level: "N5",
    },
    match: [
      { pos: "形容詞" }, // 高く
      { basic_form: "ない" }, // なかっ
      { basic_form: "た" }, // た
    ],
  },
  {
    id: "I-ADJ-KATTA",
    notes: {
      title: "Past い-Adjective",
      structure: "(Stem) + かった",
      summary:
        "The past tense form of an い-adjective. E.g., 'takakatta' (it was expensive).",
      level: "N5",
    },
    match: [{ pos: "形容詞" }, { basic_form: "た" }],
  },
  {
    id: "I-ADJ-KUNAI",
    notes: {
      title: "Negative い-Adjective",
      structure: "(Stem) + くない",
      summary:
        "The present negative form of an い-adjective. E.g., 'takakunai' (it is not expensive).",
      level: "N5",
    },
    match: [{ pos: "形容詞" }, { basic_form: "ない" }],
  },
  {
    id: "I-ADJ-KUTE",
    notes: {
      title: "Connecting い-Adjective",
      structure: "(Stem) + くて",
      summary:
        "The 'te-form' for い-adjectives, used to connect multiple adjectives or clauses. E.g., 'yasashikute, atatakai' (kind and warm).",
      level: "N5",
    },
    match: [{ pos: "形容詞" }, { pos: "助詞", basic_form: "て" }],
  },

  // ======================================================
  // === NA-ADJECTIVE & NOUN + COPULA (です/だ) ============
  // ======================================================
  {
    id: "COPULA-DEWA-ARIMASEN-DESHITA",
    notes: {
      title: "Past Negative Polite Copula (Formal)",
      structure: "Noun/な-Adj + ではありませんでした",
      summary:
        "The formal, polite past negative state-of-being. Answers 'was not'. E.g., 'gakusei dewa arimasen deshita' (I was not a student).",
      level: "N5",
    },
    match: [
      { pos: "名詞" }, // Can also be '形容動詞' - consider a helper function or regex for pos
      { surface_form: "で" },
      { surface_form: "は" },
      { basic_form: "ある", surface_form: "あり" },
      { basic_form: "ます", surface_form: "ませ" },
      { surface_form: "ん" },
      { basic_form: "だ", surface_form: "でし" },
      { basic_form: "た" },
    ],
  },
  {
    id: "COPULA-JA-NAKATTA-DESU",
    notes: {
      title: "Past Negative Polite Copula (Colloquial)",
      structure: "Noun/な-Adj + じゃなかったです",
      summary:
        "The colloquial, polite past negative state-of-being. Answers 'was not'. More common in speech than ～ではありませんでした.",
      level: "N5",
    },
    match: [
      { pos: "名詞" },
      { surface_form: "じゃ" },
      { basic_form: "ない", surface_form: "なかっ" },
      { basic_form: "た" },
      { basic_form: "です" },
    ],
  },
  {
    id: "COPULA-DESHITA",
    notes: {
      title: "Past Polite Copula",
      structure: "Noun/な-Adj + でした",
      summary:
        "The polite past state-of-being. Answers 'was'. E.g., 'ame deshita' (it was rain).",
      level: "N5",
    },
    match: [
      { pos: "名詞" }, // or 形容動詞
      { basic_form: "だ", surface_form: "でし" },
      { basic_form: "た" },
    ],
  },
  {
    id: "NA-ADJ-PREDICATE",
    notes: {
      title: "な-Adjective + Copula",
      structure: "な-Adj + です/だ",
      summary:
        "Used when a な-adjective is the predicate of a sentence. E.g., 'kono heya wa kirei desu' (this room is clean).",
      level: "N5",
    },
    match: [
      { pos: "形容動詞" }, // The な-adjective itself
      { basic_form: "だ" }, // Catches です, だ, でした, etc.
    ],
  },
  {
    id: "NA-ADJ-NOUN-MODIFIER",
    notes: {
      title: "な-Adjective Modifying a Noun",
      structure: "な-Adj + な + Noun",
      summary:
        "When a な-adjective comes before a noun to describe it, it must be followed by な. E.g., 'kirei na hana' (a beautiful flower).",
      level: "N5",
    },
    match: [{ pos: "形容動詞" }, { surface_form: "な", pos: "助動詞" }],
  },

  // ======================================================
  // === OTHER CONSTRUCTIONS ==============================
  // ======================================================
  {
    id: "NOUN-GA-ARIMASU",
    notes: {
      title: "Existence (Inanimate)",
      structure: "Noun + が + あります/ありません",
      summary:
        "Indicates the existence of an inanimate object. Translates to 'There is/are...'.",
      level: "N5",
    },
    match: [
      { pos: "名詞" },
      { surface_form: "が" },
      { basic_form: "ある" }, // Catches あります, ありません, あった, etc.
    ],
  },
  {
    id: "NOUN-GA-IMASU",
    notes: {
      title: "Existence (Animate)",
      structure: "Noun + が + います/いません",
      summary:
        "Indicates the existence of an animate object (person or animal). Translates to 'There is/are...'.",
      level: "N5",
    },
    match: [
      { pos: "名詞" },
      { surface_form: "が" },
      { basic_form: "いる" }, // Catches います, いません, いた, etc.
    ],
  },
  // ======================================================
  // === CONJUNCTIONS & REASONING =========================
  // ======================================================
  {
    id: "REASON-NODE",
    notes: {
      title: "Reason Marker (ので)",
      structure: "Plain Form + ので",
      summary:
        "Indicates a reason or cause, similar to 'kara'. 'Node' often sounds slightly more formal or explanatory than 'kara' and implies a natural consequence.",
      level: "N5",
    },
    match: [
      // This is often tokenized as two separate particles
      { pos: "助詞", basic_form: "の" },
      { pos: "助詞", basic_form: "で" },
    ],
  },
  {
    id: "REASON-KARA",
    notes: {
      title: "Reason Marker (から)",
      structure: "Clause + から",
      summary:
        "Indicates a reason or cause, translating to 'because' or 'so'. It often emphasizes the speaker's subjective reasoning or judgment.",
      level: "N5",
    },
    match: [
      // 'kara' is usually a single particle token
      { pos: "助詞", surface_form: "から" },
    ],
  },
  {
    id: "ARU-NAI",
    notes: {
      title: "Existence (Negative Plain Form)",
      structure: "ない",
      summary:
        "The plain negative form of the verb 'ある' (to exist for inanimate objects). It means 'does not exist' or 'do not have'.",
      level: "N5",
    },
    match: [
      // This rule identifies the specific token 'ない' when its dictionary form is 'ある'
      { basic_form: "ある", surface_form: "ない" },
    ],
  },
];

/**
 * Checks if a single token matches a rule step.
 */
function tokenMatchesStep(token: Token, step: GrammarRuleStep): boolean {
  // Handle the case where pos can be an array of strings
  if (step.pos) {
    if (Array.isArray(step.pos)) {
      if (!step.pos.includes(token.pos)) return false;
    } else {
      if (token.pos !== step.pos) return false;
    }
  }
  if (step.basic_form && token.basic_form !== step.basic_form) return false;
  if (step.surface_form && token.surface_form !== step.surface_form)
    return false;
  return true;
}

/**
 * Finds all grammar rule matches in a sequence of tokens.
 * This version correctly prioritizes the LONGEST possible match at any given position,
 * fixing the greedy matching issue.
 */
export function findGrammarMatches(
  tokens: Token[],
  rules: GrammarRule[]
): GrammarMatch[] {
  const allMatches: GrammarMatch[] = [];
  let i = 0;
  while (i < tokens.length) {
    let bestMatch: GrammarMatch | null = null;

    // 1. Check EVERY rule to see if it can match starting at the current token `i`.
    for (const rule of rules) {
      if (i + rule.match.length > tokens.length) continue;

      let isMatch = true;
      const currentMatchedTokens: Token[] = [];
      for (let j = 0; j < rule.match.length; j++) {
        const token = tokens[i + j];
        const step = rule.match[j];
        if (!tokenMatchesStep(token, step)) {
          isMatch = false;
          break;
        }
        currentMatchedTokens.push(token);
      }

      // 2. If it's a match, check if it's the longest one we've found so far.
      if (isMatch) {
        if (
          !bestMatch ||
          currentMatchedTokens.length > bestMatch.matchedTokens.length
        ) {
          bestMatch = {
            ruleId: rule.id,
            start: i,
            end: i + rule.match.length,
            matchedTokens: currentMatchedTokens,
          };
        }
      }
    }

    // 3. After checking all rules, commit the best (longest) match we found.
    if (bestMatch) {
      console.log("Best match: ", { bestMatch, tokens: tokens[i] }); // Debug log for the best match
      allMatches.push(bestMatch);
      // 4. Advance the loop counter PAST the entire matched group.
      i = bestMatch.end;
    } else {
      // If no match was found at all, just move to the next token.
      i++;
    }
  }
  return allMatches;
}
