import { sessionManager } from "@poc/bot/utils/session-manager";

export async function generateWelcomeMessage(
  phoneNumber: string
): Promise<string> {
  const session = sessionManager.getSession(phoneNumber);
  const isReturningCustomer = session.userData.name;

  if (isReturningCustomer) {
    return `Olá ${session.userData.name}! 😊 Que bom te ver de novo!

🔥 *BARBEARIA PREMIUM* 🔥

Como posso te ajudar hoje?

*Opções rápidas:*
📅 *1* - Agendar horário
💰 *2* - Ver preços
📍 *3* - Informações e localização
⏰ *4* - Horários de funcionamento

*Ou me fale diretamente o que precisa!*`;
  }

  return `Olá! Bem-vindo à *BARBEARIA PREMIUM* 🔥

Aqui você encontra o melhor em:
✂️ Cortes masculinos modernos
🪒 Barba e bigode
💆‍♂️ Relaxamento e cuidados

*Como posso te ajudar?*

📅 *1* - Agendar horário
💰 *2* - Ver preços
📍 *3* - Informações e localização
⏰ *4* - Horários de funcionamento

*Digite uma opção ou me fale diretamente o que precisa!*`;
}
