export async function handleUnknownMessage(message: string): Promise<string> {
  return `Desculpe, não entendi muito bem sua mensagem. 😅

*Como posso te ajudar?*

📅 *Agendar horário* - Digite "agendar" ou "marcar horário" ou 1
💰 *Ver preços* - Digite "preços" ou "valores" ou 2
📍 *Informações* - Digite "informações" ou "endereço" ou 3
⏰ *Horários* - Digite "horários" ou "funcionamento" ou 4

*Ou me explique melhor o que você precisa!*

*Exemplo:* "Quero cortar o cabelo amanhã de manhã"`;
}
