import "dotenv/config";

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models",
  {
    headers: {
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
  }
);

if (!response.ok) {
  console.error(await response.text());
  process.exit(1);
}

const data = await response.json();

const models = data.models
  .filter((model) =>
    model.supportedGenerationMethods?.includes("generateContent")
  )
  .map((model) => model.name);

console.log("Available Gemini models:", models);