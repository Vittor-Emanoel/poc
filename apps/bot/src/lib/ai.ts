import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@poc/bot/config/env";

const gemini = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const geminiAI = gemini.getGenerativeModel({
  model: "gemini-2.0-flash",
});
