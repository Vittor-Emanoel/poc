import { geminiAI } from "@poc/bot/lib/ai";
import { sessionManager } from "@poc/bot/utils/session-manager";

export async function handleServiceRequest(
  message: string,
  phoneNumber: string
): Promise<string> {
  const session = sessionManager.getSession(phoneNumber);

  // Atualizar contexto da sessão
  sessionManager.updateSession(phoneNumber, {
    currentFlow: "service_request",
  });

  const prompt = `
Você é um atendente especializado de barbearia. O cliente quer agendar um serviço.

Mensagem do cliente: "${message}"

Responda de forma amigável e profissional, oferecendo:
1. Horários disponíveis (manhã, tarde, noite)
2. Principais serviços (corte, barba, combo)
3. Pergunte qual serviço prefere
4. Solicite o nome se não tiver

Seja conciso mas completo. Use emojis moderadamente.
  `;

  try {
    const result = await geminiAI.generateContent(prompt);
    let response = result.response.text();

    // Adicionar informações práticas
    response += `\n\n*Horários disponíveis hoje:*
🌅 Manhã: 08:00 - 12:00
🌞 Tarde: 14:00 - 18:00
🌙 Noite: 19:00 - 22:00

*Qual serviço você gostaria?*
✂️ Corte simples (R$ 25)
🪒 Barba (R$ 15)
🔥 Combo completo (R$ 35)

*Me fale seu nome e horário preferido!*`;

    return response;
  } catch (error) {
    console.error("Erro ao processar solicitação de serviço:", error);
    return `Perfeito! Vamos agendar seu horário! 📅

*Horários disponíveis:*
🌅 Manhã: 08:00 - 12:00
🌞 Tarde: 14:00 - 18:00
🌙 Noite: 19:00 - 22:00

*Nossos serviços:*
✂️ Corte simples - R$ 25
🪒 Barba - R$ 15
🔥 Combo completo - R$ 35

*Por favor, me informe:*
- Seu nome
- Serviço desejado
- Horário preferido

*Exemplo:* "João, combo completo, hoje às 15h"`;
  }
}
