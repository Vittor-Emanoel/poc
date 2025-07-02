import type { proto, WASocket } from "baileys";
import { interpret } from "../IA/interpreter";

export async function startBot(sock: WASocket, msg: proto.IWebMessageInfo) {
  const from = msg.key.remoteJid!;
  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

  if (!text) return;

  const response = await interpret(text);

  if (response?.status === "not_identified") {
    await sock.sendMessage(from, {
      text: response.message ?? "Desculpe, não consegui entender sua mensagem. Pode reformular?",
    });
    return;
  }

  // Exemplo de resposta formatada
  const summary = `
✅ Entendi! Aqui estão os dados:

📅 Data: ${response.date}
💈 Serviço: ${response.service}
✂️ Barbeiro: ${response.barber}
🙋 Cliente: ${response.customer}

Tudo certo? Posso confirmar o agendamento?
  `.trim();

  await sock.sendMessage(from, { text: summary });
}
