import { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { getTokenizer } from "@/parser/Tokenizer";
import { type IpadicFeatures } from "@sglkc/kuromoji";
import { SingleWord } from "./SingleWord";
import { findGrammarMatches } from "@/utils/grammar";
import { type GrammarMatch } from "@/types";
import { matchGrammar, grammarRules } from "@/data/grammar";

interface Props {
  sentence: string;
}

export function SentenceRenderer({ sentence }: Props) {
  const [tokens, setTokens] = useState<IpadicFeatures[]>([]);
  const [matches, setMatches] = useState<GrammarMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const tokenize = async () => {
      try {
        const tokenizer = await getTokenizer();
        const result = tokenizer.tokenize(sentence);
        if (isMounted) {
          setTokens(result);
          setMatches(findGrammarMatches(result));
          setLoading(false);
        }
      } catch (e) {
        console.error("Tokenization failed:", e);
      }
    };

    tokenize();
    return () => {
      isMounted = false;
    };
  }, [sentence]);

  if (loading) return <ActivityIndicator style={styles.loader} />;

  const tokenWithMatch = tokens.map((token, index) => {
    const match = matches.find((m) => index >= m.start && index < m.end);
    return { token, match, index };
  });

  console.log("MATCHES", matchGrammar(tokens, grammarRules));

  console.log("TOKENS", tokens);

  return (
    <View style={styles.container}>
      {tokenWithMatch.map(({ token, match, index }) => (
        <SingleWord
          key={index}
          token={token}
          isMatched={!!match}
          matchId={match?.ruleId}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    margin: 12,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
});
