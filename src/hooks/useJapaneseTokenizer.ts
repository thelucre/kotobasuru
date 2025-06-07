import { useState, useEffect } from "react";
import * as JapaneseParserService from "../services/JapaneseParserService";

export function useJapaneseTokenizer() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await JapaneseParserService.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize tokenizer:", error);
      }
    };

    initialize();
  }, []);

  return {
    isInitialized,
    tokenize: JapaneseParserService.tokenize,
    getBasicForm: JapaneseParserService.getBasicForm,
  };
}
