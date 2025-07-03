export async function handleCancellation(
  message: string,
  phoneNumber: string
): Promise<string> {
  return `Entendo que você precisa cancelar. 😔

*Para cancelar seu agendamento:*
- Me informe seu nome completo
- Data e horário do agendamento
- Motivo (opcional)

*Exemplo:* "João Silva, cancelar agendamento de hoje às 15h"

⚠️ *IMPORTANTE:*
- Cancelamentos até 2h antes: sem taxa
- Cancelamentos em cima da hora: taxa de R$ 10

*Posso reagendar para outro horário?*
📅 Temos vagas disponíveis nos próximos dias!

*Ou me ligue:* 📞 (11) 99999-9999`;
}
