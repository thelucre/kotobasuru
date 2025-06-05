// @/src/utils/grammar.ts
import { Token, GrammarMatch, GrammarRule } from "@/types";
import { grammarRules } from "@/data/grammar";

export function findGrammarMatches(tokens: Token[]): GrammarMatch[] {
  const matches: GrammarMatch[] = [];

  for (const rule of grammarRules) {
    if (!rule.pattern || !Array.isArray(rule.pattern)) continue;

    for (let i = 0; i <= tokens.length - rule.pattern.length; i++) {
      const slice = tokens.slice(i, i + rule.pattern.length);
      let matched = true;

      for (let j = 0; j < rule.pattern.length; j++) {
        const step = rule.pattern[j];
        const token = slice[j];

        if (!token) {
          matched = false;
          break;
        }

        if (
          (step.pos && step.pos !== token.pos) ||
          (step.basic_form && step.basic_form !== token.basic_form) ||
          (step.surface_form && step.surface_form !== token.surface_form) ||
          (step.conjugated_form &&
            step.conjugated_form !== token.conjugated_form)
        ) {
          matched = false;
          break;
        }
      }

      if (matched) {
        matches.push({
          ruleId: rule.id,
          start: i,
          end: i + rule.pattern.length,
          matchedTokens: slice,
        });
      }
    }
  }

  return matches;
}
