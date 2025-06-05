// @/data/grammar.ts
import type {
  Token,
  GrammarRule,
  GrammarMatch,
  GrammarRuleStep,
} from "@/types";

function tokenMatchesRuleStep(token: Token, step: GrammarRuleStep): boolean {
  if (step.exact) {
    // All fields must match exactly
    return (
      step.surface_form === token.surface_form &&
      step.basic_form === token.basic_form &&
      step.conjugated_form === token.conjugated_form &&
      step.pos === token.pos
    );
  } else {
    // Match if all defined fields match
    if (step.surface_form && step.surface_form !== token.surface_form)
      return false;
    if (step.basic_form && step.basic_form !== token.basic_form) return false;
    if (step.conjugated_form && step.conjugated_form !== token.conjugated_form)
      return false;
    if (step.pos && step.pos !== token.pos) return false;
    return true;
  }
}

function tokenMatches(token: Token, step: GrammarRuleStep): boolean {
  return (
    (!step.pos || token.pos === step.pos) &&
    (!step.surface_form || token.surface_form === step.surface_form) &&
    (!step.basic_form || token.basic_form === step.basic_form) &&
    (!step.conjugated_form || token.conjugated_form === step.conjugated_form)
  );
}

export function matchGrammar(
  tokens: Token[],
  rules: GrammarRule[]
): GrammarMatch[] {
  const matches: GrammarMatch[] = [];

  for (const rule of rules) {
    const steps = rule.match;

    for (let i = 0; i <= tokens.length - steps.length; i++) {
      const window = tokens.slice(i, i + steps.length);
      const allMatch = steps.every((step, idx) =>
        tokenMatches(window[idx], step)
      );

      if (allMatch) {
        matches.push({
          ruleId: rule.id,
          start: i,
          end: i + steps.length,
          matchedTokens: window,
        });
      }
    }
  }

  return matches;
}

export const grammarRules: GrammarRule[] = [
  {
    id: "polite_past",
    explanation: "Polite verb in past form",
    match: [
      { basic_form: "ます", pos: "助動詞" },
      { basic_form: "た", pos: "助動詞" },
    ],
  },
  {
    id: "negative_polite_past",
    explanation: "Negative past polite form (〜ませんでした)",
    match: [
      { basic_form: "ます", pos: "助動詞" },
      { surface_form: "ん", pos: "助動詞" },
      { basic_form: "です", pos: "助動詞" },
      { basic_form: "た", pos: "助動詞" },
    ],
  },
  {
    id: "te_form",
    explanation: "Te-form",
    match: [
      { conjugated_form: "連用タ接続", pos: "動詞" },
      { surface_form: "て", pos: "助詞" },
    ],
  },
  {
    id: "progressive",
    explanation: "〜ている for ongoing actions",
    match: [
      { conjugated_form: "連用タ接続", pos: "動詞" },
      { surface_form: "て", pos: "助詞" },
      { basic_form: "いる", pos: "動詞" },
    ],
  },
  {
    id: "intention_expression",
    explanation: "〜つもりです for expressing intent",
    match: [
      { pos: "動詞" },
      { surface_form: "つもり", pos: "名詞" },
      { basic_form: "です", pos: "助動詞" },
    ],
  },
  {
    id: "reason",
    explanation: "〜ので for giving reason",
    match: [{ surface_form: "ので", pos: "助詞" }],
  },
];
