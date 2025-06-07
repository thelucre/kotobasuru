import fs from "fs/promises";
import path from "path";

// This is a placeholder for the actual Gemini API call.
// You would use the Google AI SDK here.
async function callGeminiAPI(prompt: string): Promise<string> {
  console.log("--- PROMPT ---");
  console.log(prompt);
  console.log("----------------");

  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mocked JSON response
  const mockResponse = {
    locationId: "konbini",
    level: "N5",
    words: [
      {
        id: "irasshaimase",
        kana: "いらっしゃいませ",
        meaning: "Welcome (to the store)",
        partOfSpeech: "expression",
      },
      {
        id: "obentou",
        kana: "おべんとう",
        kanji: "お弁当",
        meaning: "boxed lunch",
        partOfSpeech: "noun",
      },
    ],
    scenes: [
      {
        id: "konbini_2",
        title: "Late Night Snack",
        lines: [
          "すみません、肉まんはありますか？",
          "はい、あちらにございます。",
        ],
        wordIds: ["sumimasen", "nikuman", "arimasu", "achira", "gozaimasu"],
      },
    ],
  };

  return JSON.stringify(mockResponse, null, 2);
}

function generatePrompt(
  location: string,
  level: string,
  wordHints: string[],
  quantity: number
): string {
  const typeDefinitions = `
  interface WordEntry { id: string; kana: string; kanji?: string; meaning: string; partOfSpeech: string; }
  interface Scene { id: string; title: string; lines: string[]; wordIds: string[]; }
  interface ContentPack { locationId: string; level: string; words: WordEntry[]; scenes: Scene[]; }
  `;

  return `
**Role:** You are a curriculum designer for a Japanese language app. You create realistic, everyday scenarios.
**Goal:** Generate a structured JSON object representing a "ContentPack" for a specific location and JLPT level.

**Format:**
- The output MUST be a single, valid JSON object. Do not include any text before or after the JSON block.
- Use the following TypeScript interface for the structure:
  \`\`\`typescript
  ${typeDefinitions}
  \`\`\`

**Request:**
- **locationId:** "${location}"
- **level:** "${level}"
- **Scene Quantity:** ${quantity}
- **Content Focus:** Create short, natural-sounding sentences. The scenes should feel like small, real moments. Include vocabulary related to the location and some of these hint words if possible: ${wordHints.join(
    ", "
  )}.

**Your Task:**
Generate the JSON for the ContentPack now.
  `;
}

async function generatePack(
  location: string,
  level: string,
  wordHints: string[],
  quantity: number
) {
  console.log(`Generating content pack for ${location} (Level: ${level})...`);
  const prompt = generatePrompt(location, level, wordHints, quantity);
  const jsonString = await callGeminiAPI(prompt);

  try {
    // Validate that the response is valid JSON
    JSON.parse(jsonString);

    const outputDir = path.join(process.cwd(), "src", "assets", "content");
    await fs.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, `${location}_${level}.json`);

    await fs.writeFile(outputPath, jsonString);
    console.log(`✅ Content pack saved to: ${outputPath}`);
  } catch (error) {
    console.error("❌ Failed to generate content pack.");
    console.error("Gemini response was not valid JSON:");
    console.error(jsonString);
    process.exit(1);
  }
}

// --- Script Execution ---
async function main() {
  const args = process.argv.slice(2);
  const location = args
    .find((arg) => arg.startsWith("--location="))
    ?.split("=")[1];
  const level = args.find((arg) => arg.startsWith("--level="))?.split("=")[1];
  const quantity = Number(
    args.find((arg) => arg.startsWith("--quantity="))?.split("=")[1]
  );

  if (!location || !level || !quantity) {
    console.error(
      "Usage: node scripts/generateContentPack.js --location=<id> --level=<N5|N4|...> --quantity=<number>"
    );
    process.exit(1);
  }

  await generatePack(location, level, [], quantity);
}

main();
