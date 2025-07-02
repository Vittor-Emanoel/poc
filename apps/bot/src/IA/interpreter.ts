import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiAI } from "../infra/clients/ai";
import { MESSAGE_TYPE_PROMPT } from "./prompts";

export class Interpreter {
  private model: GoogleGenerativeAI;

  constructor() {
    this.model = geminiAI;
  }

  async getMessageType(msg: string) {
    const model = this.model.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(msg, 
      MESSAGE_TYPE_PROMPT);
    const responseText = result.response.text().trim();
    return responseText;
  }
}