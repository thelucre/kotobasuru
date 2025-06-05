// src/components/SentenceRenderer/SentenceRenderer.tsx
import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { getTokenizer } from "@/parser/Tokenizer"; // Assuming you have a tokenizer utility
import { Token, GrammarMatch } from "@/types";
import { findGrammarMatches, GRAMMAR_RULES } from "@/core/sentenceProcessor";

// --- Mock Components for Demonstration ---

// Your component for a single, ungrouped token
const SingleWord = ({ token }: { token: Token }) => (
  <Pressable style={styles.tokenWrapper}>
    <Text style={styles.tokenText}>{token.surface_form}</Text>
  </Pressable>
);

// Your component for a matched grammar group
const GrammarGroup = ({
  match,
  explanation,
}: {
  match: GrammarMatch;
  explanation: string;
}) => {
  const combinedText = match.matchedTokens.map((t) => t.surface_form).join("");
  return (
    <Pressable style={[styles.tokenWrapper, styles.grammarGroup]}>
      <Text style={[styles.tokenText, styles.grammarText]}>{combinedText}</Text>
      <Text style={styles.explanationText}>{explanation}</Text>
    </Pressable>
  );
};

// --- The Main Renderer Component ---

interface SentenceRendererProps {
  sentence: string;
}

export default function SentenceRenderer({ sentence }: SentenceRendererProps) {
  const [tokens, setTokens] = useState<Token[]>([]);

  // 1. Tokenize the sentence when it changes
  useEffect(() => {
    let isMounted = true;
    const tokenize = async () => {
      const tokenizer = await getTokenizer();
      const result = tokenizer.tokenize(sentence);
      if (isMounted) {
        setTokens(result);
      }
    };
    tokenize();
    return () => {
      isMounted = false;
    };
  }, [sentence]);

  // 2. Process tokens to create renderable components
  const renderedComponents = useMemo(() => {
    if (tokens.length === 0) return [];

    const matches = findGrammarMatches(tokens, GRAMMAR_RULES);
    console.log("MATCHES", matches); // Your original log
    console.log("TOKENS", tokens); // Your original log

    const components: React.ReactNode[] = [];
    let i = 0;
    while (i < tokens.length) {
      // Check if a match starts at the current position
      const match = matches.find((m) => m.start === i);

      if (match) {
        // If yes, create a GrammarGroup component for the whole match
        const rule = GRAMMAR_RULES.find((r) => r.id === match.ruleId);
        components.push(
          <GrammarGroup
            key={`match-${i}`}
            match={match}
            explanation={rule?.explanation || ""}
          />
        );
        // And skip the loop ahead past all the tokens in this match
        i = match.end;
      } else {
        // If no, create a SingleWord component for the current token
        components.push(<SingleWord key={`token-${i}`} token={tokens[i]} />);
        i++;
      }
    }
    return components;
  }, [tokens]);

  return <View style={styles.sentenceContainer}>{renderedComponents}</View>;
}

// --- Styles ---
const styles = StyleSheet.create({
  sentenceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    alignItems: "flex-end",
  },
  tokenWrapper: {
    margin: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tokenText: {
    fontSize: 20,
  },
  grammarGroup: {
    backgroundColor: "#e0f7fa", // A different color for grammar points
    borderColor: "#00bcd4",
  },
  grammarText: {
    color: "#00796b",
    fontWeight: "bold",
  },
  explanationText: {
    fontSize: 12,
    color: "#00796b",
    textAlign: "center",
    marginTop: 2,
  },
});
