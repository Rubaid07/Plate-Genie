import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { ingredients } = await req.json();

  if (!ingredients || ingredients.length === 0) {
    return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
  }

  try {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Based on these ingredients: [${ingredients.join(', ')}], suggest a few creative and easy-to-make recipes. The recipes must be strictly in the following JSON format. Do not include any other text, explanation, or notes outside of the JSON. If you cannot generate any recipe, return an empty JSON array.

[
  {
    "name": "...",
    "ingredients": ["...", "..."],
    "instructions": "..."
  },
  {
    "name": "...",
    "ingredients": ["...", "..."],
    "instructions": "..."
  }
]`;

  const result = await model.generateContent(prompt);
  let responseText = result.response.text();

  console.log("Gemini API Raw Response:", responseText);

  responseText = responseText.replace(/```json|```/g, '').trim();

  if (!responseText.startsWith('[') || !responseText.endsWith(']')) {
    throw new Error('API returned an invalid JSON format.');
  }

  const recipes = JSON.parse(responseText);

  return NextResponse.json(recipes, { status: 200 });

} catch (error) {
  console.error("API call failed:", error);
  return NextResponse.json({ error: "Failed to generate meal plan. Please check your API key or try again." }, { status: 500 });
}
}