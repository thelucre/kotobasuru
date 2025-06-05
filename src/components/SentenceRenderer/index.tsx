import { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { getTokenizer } from "@/parser/Tokenizer";
import { type IpadicFeatures } from "@sglkc/kuromoji";
import { SingleWord } from "./SingleWord";

interface Props {
  sentence: string;
}

export function SentenceRenderer({ sentence }: Props) {
  const [tokens, setTokens] = useState<IpadicFeatures[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const tokenize = async () => {
      try {
        const tokenizer = await getTokenizer();
        const result = tokenizer.tokenize(sentence);
        if (isMounted) {
          setTokens(result);
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

  if (loading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {tokens?.map((token, idx) => (
        <SingleWord key={idx} token={token} />
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
    // padding: 12,
  },
});
