// Note: This is a placeholder for the actual Gemini API implementation.
// In a real application, you would use the official Google AI SDK.
const API_KEY = "YOUR_GEMINI_API_KEY"; // TODO: Replace with your actual API key

/**
 * Gets gentle, reflective feedback on a user's reply.
 *
 * @param contextSentence The sentence the user was responding to.
 * @param userReply The user's reply.
 * @returns A promise that resolves to the AI's feedback.
 */
export async function getReplyFeedback(
  contextSentence: string,
  userReply: string
): Promise<string> {
  // This is a mocked response for development and testing.
  // Replace this with your actual Gemini API call.
  console.log("Calling Gemini API with:", { contextSentence, userReply });

  const prompt = `
    **Role:** You are a kind, encouraging Japanese language sensei named "Kotoba Sensei".
    **Goal:** You never say the user is "wrong". Instead, you reflect their intention and gently guide them towards a more natural expression. Your tone is warm, insightful, and supportive. You are helping them "live inside" the language, not pass a test.

    **Constraints:**
    1.  NEVER use the words "wrong", "incorrect", "mistake", or "error".
    2.  ALWAYS start by acknowledging the user's intent positively. (e.g., "Ah, I see what you were feeling!", "That's a great way to express that feeling of...")
    3.  Provide ONE OR TWO natural-sounding alternatives, explaining the nuance. (e.g., "A native speaker might say it this way to sound a bit more casual...", "In a store, this phrase is very common...")
    4.  Keep the feedback concise, under 50 words.
    5.  The output should be a single string of plain text.

    **Context:**
    - The user was in a scene and heard this sentence: "${contextSentence}"
    - The user replied with: "${userReply}"

    **Your Task:**
    Provide gentle, reflective feedback based on the user's reply in this context.
  `;

  // Simulate a network request
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mocked response
  if (userReply.includes("ありがとう")) {
    return "Ah, you are expressing gratitude! A very natural way to say this is 「どうもありがとうございます」 for extra politeness.";
  } else {
    return "That's a wonderful way to put it. To sound a bit more like a native speaker, you could also try 「[Alternative Phrase]」.";
  }
}
