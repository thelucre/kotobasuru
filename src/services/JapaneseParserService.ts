import * as kuromoji from "@sglkc/kuromoji";
import { Token } from "../types/data";

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null = null;

/**
 * Initializes the kuromoji tokenizer.
 * This must be called before any other function in this service.
 */
export async function initialize(): Promise<void> {
  if (tokenizer) {
    return;
  }
  return new Promise((resolve, reject) => {
    kuromoji
      .builder({ dicPath: "/dicts" }) // Path to the dictionary files
      .build((err, builtTokenizer) => {
        if (err) {
          console.error("Failed to initialize JapaneseParserService.", err);
          reject(err);
        } else {
          tokenizer = builtTokenizer;
          resolve();
        }
      });
  });
}

/**
 * Tokenizes a Japanese sentence.
 * @param sentence The sentence to tokenize.
 * @returns A promise that resolves to an array of tokens.
 */
export async function tokenize(sentence: string): Promise<Token[]> {
  if (!tokenizer) {
    throw new Error("Tokenizer not initialized. Call initialize() first.");
  }
  return tokenizer.tokenize(sentence) as unknown as Token[];
}

/**
 * Gets the basic form (dictionary form) of a token.
 * @param token The token.
 * @returns The basic form of the word.
 */
export function getBasicForm(token: Token): string {
  return token.basic_form;
}
