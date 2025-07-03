import { geminiAI } from "../lib/ai";
import { MessageType } from "../types/message";
import { UserSession } from "../types/session";
import { sessionManager } from "../utils/session-manager";

const generateClassificationPrompt = (
  message: string,
  context?: UserSession
): string => {
  const contextInfo = context?.currentFlow
    ? `\nContexto da conversa anterior: ${context.currentFlow}`
    : "";

  return `
Você é um assistente especializado em classificar mensagens para uma barbearia moderna.

Analise a mensagem e retorne APENAS uma das seguintes classificações:

- "welcome_message": Saudações iniciais, primeiros contatos, "oi", "olá", "boa tarde"
- "service_request": Solicitações de agendamento, "quero marcar", "tem horário", "agendar"
- "information": Perguntas sobre preços, endereço, horários, serviços, "quanto custa", "onde fica"
- "appointment_confirmation": Confirmação/alteração de agendamentos já marcados
- "cancellation_request": Cancelamento de serviços, "cancelar", "desmarcar"
- "complaint_feedback": Reclamações, elogios, feedback sobre serviços
- "unknown": Mensagens confusas ou fora do contexto da barbearia

Mensagem do cliente: "${message}"${contextInfo}

Responda apenas com a classificação correspondente (sem aspas ou explicações).
  `;
};

export const classifyMessage = async (
  message: string,
  phoneNumber: string
): Promise<MessageType> => {
  try {
    const session = sessionManager.getSession(phoneNumber);
    const prompt = generateClassificationPrompt(message, session);

    const result = await geminiAI.generateContent(prompt);
    const response = result.response.text().trim().toLowerCase();

    // Validação mais rigorosa da resposta
    const validTypes: MessageType[] = [
      "welcome_message",
      "service_request",
      "information",
      "appointment_confirmation",
      "cancellation_request",
      "complaint_feedback",
      "unknown",
    ];

    if (validTypes.includes(response as MessageType)) {
      return response as MessageType;
    }

    // Fallback baseado em palavras-chave
    return classifyByKeywords(message);
  } catch (error) {
    console.error("Erro na classificação da mensagem:", error);
    return classifyByKeywords(message);
  }

  // Classificação de fallback baseada em palavras-chave
  function classifyByKeywords(message: string): MessageType {
    const text = message.toLowerCase();

    // Palavras-chave para cada tipo
    const keywords = {
      welcome: [
        "oi",
        "olá",
        "boa tarde",
        "bom dia",
        "boa noite",
        "hey",
        "e aí",
      ],
      service: [
        "agendar",
        "marcar",
        "horário",
        "disponível",
        "vaga",
        "cortar",
        "barba",
      ],
      information: [
        "preço",
        "valor",
        "quanto",
        "endereço",
        "onde",
        "horário",
        "funcionamento",
        "2",
      ],
      cancellation: ["cancelar", "desmarcar", "não vou", "não posso"],
      confirmation: ["confirmar", "alterar", "mudar", "reagendar"],
    };

    if (keywords.welcome.some((word) => text.includes(word)))
      return "welcome_message";
    if (keywords.service.some((word) => text.includes(word)))
      return "service_request";
    if (keywords.information.some((word) => text.includes(word)))
      return "information";
    if (keywords.cancellation.some((word) => text.includes(word)))
      return "cancellation_request";
    if (keywords.confirmation.some((word) => text.includes(word)))
      return "appointment_confirmation";

    return "unknown";
  }
};
