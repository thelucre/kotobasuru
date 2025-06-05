// src/core/sentenceProcessor.ts

import { Token, GrammarRule, GrammarRuleStep, GrammarMatch } from "@/types";

/**
 * Define your grammar rules here.
 * This is the core of your matching system.
 */
export const GRAMMAR_RULES: GrammarRule[] = [
  {
    id: "V-MASHITA",
    explanation: "Past-polite form of a verb (~mashita).",
    match: [
      { pos: "動詞" }, // 1. Any Verb
      { basic_form: "ます", surface_form: "まし" }, // 2. The 'masu' auxiliary in its 'mashi' form
      { basic_form: "た", surface_form: "た" }, // 3. The past-tense auxiliary 'ta'
    ],
  },
  {
    id: "V-MASU",
    explanation: "Present-polite form of a verb (~masu).",
    match: [
      { pos: "動詞" }, // 1. Any Verb
      { basic_form: "ます", surface_form: "ます" }, // 2. The 'masu' auxiliary
    ],
  },
  {
    id: "V-MASEN-DESHITA",
    explanation: "Past-negative-polite form of a verb (~masen deshita).",
    match: [
      { pos: "動詞" }, // 1. Any Verb
      { basic_form: "ます", surface_form: "ませ" }, // 2. The 'masu' auxiliary in its 'mase' form
      { surface_form: "ん" }, // 3. The 'n' negative marker
      { basic_form: "だ", surface_form: "でし" }, // 4. The 'da' copula in its 'deshi' form
      { basic_form: "た", surface_form: "た" }, // 5. The past-tense auxiliary 'ta'
    ],
  },
  // Add more rules here: V-te, i-adj+desu, etc.
];

/**
 * Checks if a single token matches a rule step.
 */
function tokenMatchesStep(token: Token, step: GrammarRuleStep): boolean {
  if (step.pos && token.pos !== step.pos) return false;
  if (step.basic_form && token.basic_form !== step.basic_form) return false;
  if (step.surface_form && token.surface_form !== step.surface_form)
    return false;
  // Add other checks from GrammarRuleStep if needed
  return true;
}

/**
 * Finds all grammar rule matches in a sequence of tokens.
 */
export function findGrammarMatches(
  tokens: Token[],
  rules: GrammarRule[]
): GrammarMatch[] {
  const matches: GrammarMatch[] = [];
  for (let i = 0; i < tokens.length; i++) {
    for (const rule of rules) {
      if (i + rule.match.length > tokens.length) continue;

      let isMatch = true;
      const matchedTokens: Token[] = [];
      for (let j = 0; j < rule.match.length; j++) {
        const token = tokens[i + j];
        const step = rule.match[j];
        if (!tokenMatchesStep(token, step)) {
          isMatch = false;
          break;
        }
        matchedTokens.push(token);
      }

      if (isMatch) {
        matches.push({
          ruleId: rule.id,
          start: i,
          end: i + rule.match.length,
          matchedTokens,
        });
        // Important: Advance i to avoid overlapping matches within the same group
        i += rule.match.length - 1;
        break; // Stop checking other rules for this starting position
      }
    }
  }
  return matches;
}
