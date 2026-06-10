import dotenv from 'dotenv';
dotenv.config({ override: true });

const key = process.env.GEMINI_API_KEY;

if (!key) {
  console.error("Error: GEMINI_API_KEY is not defined!");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

async function listModels() {
  try {
    console.log("Fetching models list from API...");
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error("\nAPI returned an error:");
      console.error(JSON.stringify(data.error, null, 2));
      return;
    }

    console.log("\nAvailable Models:");
    if (data.models && data.models.length > 0) {
      data.models.forEach(model => {
        console.log(`- ${model.name} (${model.displayName})`);
      });
    } else {
      console.log("No models returned.");
      console.log(data);
    }
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

listModels();
