import { geminiAI } from "@poc/bot/lib/ai";

export async function handleComplaintFeedback(
  message: string,
  phoneNumber: string
): Promise<string> {
  const prompt = `
O cliente está dando feedback/reclamação sobre a barbearia.

Mensagem: "${message}"

Responda de forma empática e profissional:
- Agradeça o feedback
- Se for reclamação, peça desculpas e ofereça solução
- Se for elogio, agradeça calorosamente
- Sempre termine oferecendo mais ajuda

Seja genuíno e atencioso.
  `;

  try {
    const result = await geminiAI.generateContent(prompt);
    let response = result.response.text();

    response += `\n\n*Seu feedback é muito importante para nós!*

📞 *Para contato direto:*
WhatsApp: (11) 99999-9999
Email: contato@barbeariapremium.com

*Posso ajudar com mais alguma coisa?*`;

    return response;
  } catch (error) {
    console.error("Erro ao processar feedback:", error);
    return `Muito obrigado pelo seu feedback! 🙏

Sua opinião é fundamental para melhorarmos nossos serviços.

*Para questões mais específicas:*
📞 WhatsApp: (11) 99999-9999
📧 Email: contato@barbeariapremium.com

*Posso te ajudar com mais alguma coisa?*`;
  }
}
