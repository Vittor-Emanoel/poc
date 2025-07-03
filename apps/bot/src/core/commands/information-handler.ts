import { geminiAI } from "@poc/bot/lib/ai";

const essentialInfo = `
*INFORMAÇÕES ESSENCIAIS*

💰 *PREÇOS:*
✂️ Corte simples: R$ 25
🪒 Barba: R$ 15
🔥 Combo (corte + barba): R$ 35
💆‍♂️ Relaxamento: R$ 10

⏰ *HORÁRIOS:*
Segunda a Sexta: 08:00 - 22:00
Sábado: 08:00 - 20:00
Domingo: 10:00 - 18:00

📍 *ENDEREÇO:*
Rua das Flores, 123 - Centro
(Próximo ao Shopping Center)

💳 *PAGAMENTO:*
Dinheiro, PIX, Cartão

*Quer agendar? É só me falar!*`;

export async function handleInformationRequest(
  message: string
): Promise<string> {
  const prompt = `
Você é um atendente de barbearia. O cliente está perguntando informações.

Mensagem: "${message}"

Responda com informações precisas sobre:
- Preços dos serviços
- Endereço e localização
- Horários de funcionamento
- Formas de pagamento
- Serviços disponíveis

Seja objetivo e útil. Use emojis moderadamente.
  `;

  try {
    const result = await geminiAI.generateContent(prompt);
    let response = result.response.text();

    // Garantir que informações essenciais estejam incluídas

    return response + essentialInfo;
  } catch (error) {
    console.error("Erro ao processar informações:", error);
    return essentialInfo;
  }
}
