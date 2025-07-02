import { geminiAI } from "@poc/bot/infra/clients/ai";
import { ASSISTANT_PROMPT } from "./prompts";

interface InterpretResponse {
  date?: string;
  barber?: string;
  service?: string;
  customer?: string;
  status: "not_identified" | "success" | "initial_message";
  message?: string;
}

type InterpretResult = InterpretResponse;

// const ASSISTANT_PROMPT = `
// Ao receber uma mensagem, identifique se é uma initial_message  para uma barberia e se for retorne uma resposta amigável e profissional. 

// se for uma saudação inicial, retorne uma resposta amigável e profissional, exemplo: seja bem vindo a barbaeria do ze ...

// e retorno o status: initial_message

// Você é um assistente virtual de uma barbearia. 
// Sua tarefa é interpretar mensagens de clientes no WhatsApp e extrair informações para um possível agendamento.

// Sempre que possível, responda de forma amigável, clara e profissional.

// Extraia os seguintes campos (se possível):
// - Serviço desejado (service)
// - Nome do barbeiro (barber)
// - Data do agendamento e se falar amanha faça o calculo e retorno no formato(date, formato ISO, ex: "2025-07-02")

// Se **não conseguir extrair com precisão**, retorne **apenas** esse JSON:
// {
//   "status": "not_identified",
//   "message": "Explique de forma clara por que não foi possível interpretar a mensagem"
// }

// Limite-se a sugerir no máximo 3 perguntas de retorno, em linguagem informal e acolhedora.
// `;

function extractJson(text: string): string | null {
  // Remove blocos de markdown ```json ... ```
  const jsonBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonBlock) {
    return jsonBlock[1].trim();
  }

  // Se não vier com blocos markdown, tenta pegar um JSON puro no texto
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    return text.slice(jsonStart, jsonEnd + 1);
  }

  return null;
}

export async function interpret(
  msg: string,
  existingInfo?: Partial<InterpretResponse>
): Promise<InterpretResult> {
  const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const dynamicContext = existingInfo
    ? `Informações já conhecidas: ${JSON.stringify(existingInfo, null, 2)}`
    : "";

  const fullPrompt = `
${ASSISTANT_PROMPT}

${dynamicContext}

Mensagem do cliente:
"""
${msg}
"""
Responda apenas com o JSON conforme as instruções.
`;

  try {
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text().trim();

    console.log("Resposta bruta da IA:", responseText);

    const json = extractJson(responseText);
    if (!json) throw new Error("Nenhum JSON válido encontrado na resposta.");

    const parsed = JSON.parse(json) as InterpretResult;

    if (!parsed.status || parsed.status === "not_identified") {
      return {
        status: "not_identified",
        message: parsed.message ?? "Não consegui entender a mensagem, pode reformular? 😅",
      };
    }

    return parsed;
  } catch (err) {
    console.error("Erro ao interpretar mensagem:", err);
    return {
      status: "not_identified",
      message: "Tivemos um probleminha aqui 😔 Pode repetir a mensagem, por favor?",
    };
  }
}

