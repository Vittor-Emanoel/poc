import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@poc/bot/config/env";

export const geminiAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
