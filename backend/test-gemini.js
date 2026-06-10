import dotenv from 'dotenv';
dotenv.config({ override: true });
import { GoogleGenerativeAI } from '@google/generative-ai';

const key = process.env.GEMINI_API_KEY;

if (!key) {
  console.error("Error: GEMINI_API_KEY is not defined in your environment/env file!");
  process.exit(1);
}

console.log("=== API KEY DIAGNOSTICS ===");
console.log(`Key Length: ${key.length}`);
console.log(`Key Starts With: "${key.substring(0, 10)}..."`);
console.log(`Key Ends With: "...${key.substring(key.length - 5)}"`);
console.log(`Contains Quotes: ${key.startsWith('"') || key.endsWith('"') || key.startsWith("'") || key.endsWith("'")}`);
console.log(`Contains Whitespace: ${/\s/.test(key)}`);
console.log("===========================\n");

const cleanKey = key.replace(/['"]/g, '').trim();

try {
  console.log("Initializing GoogleGenerativeAI with key...");
  const genAI = new GoogleGenerativeAI(cleanKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  console.log("Sending test request to model 'gemini-2.5-flash'...");
  const response = await model.generateContent("Hello! Repeat this exact word: 'Success'.");
  console.log("\nSuccess! Model responded:");
  console.log(response.response.text());
} catch (error) {
  console.error("\nAPI Call Failed!");
  console.error("Error Name:", error.name);
  console.error("Error Message:", error.message);
  if (error.status) console.error("HTTP Status:", error.status);
  if (error.errorDetails) {
    console.error("Error Details:", JSON.stringify(error.errorDetails, null, 2));
  }
}
