export async function handleAppointmentConfirmation(
  message: string,
  phoneNumber: string
): Promise<string> {
  return `Entendi! Vou te ajudar com seu agendamento. 📅

*Para confirmar/alterar seu horário, preciso:*
- Seu nome completo
- Data e horário atual do agendamento
- O que você gostaria de fazer (confirmar/alterar/cancelar)

*Exemplo:* "João Silva, agendado para hoje 15h, quero confirmar"

*Ou me ligue diretamente:*
📞 (11) 99999-9999

*Posso te ajudar com mais alguma coisa?*`;
}
