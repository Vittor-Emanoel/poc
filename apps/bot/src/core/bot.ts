import type { proto, WASocket } from "baileys";
import { classifyMessage } from "../utils/message-classifier";
import { sessionManager } from "../utils/session-manager";
import { handleAppointmentConfirmation } from "./commands/appointment-handler";
import { handleCancellation } from "./commands/cancellation-handler";
import { handleComplaintFeedback } from "./commands/complaint-feedback-handler";
import { errorHandlerMessage } from "./commands/error-handler";
import { handleInformationRequest } from "./commands/information-handler";
import { handleServiceRequest } from "./commands/service-request";
import { handleUnknownMessage } from "./commands/unknown-handler";
import { generateWelcomeMessage } from "./commands/welcome-message";

export async function startBot(sock: WASocket, msg: proto.IWebMessageInfo) {
  const from = msg.key.remoteJid!;
  const text =
    msg.message?.conversation || msg.message?.extendedTextMessage?.text;

  if (!text) return;

  try {
    if (Math.random() < 0.1) {
      // 10% de chance
      sessionManager.clearOldSessions();
    }

    // Classificar mensagem
    const messageType = await classifyMessage(text, from);

    let response: string;

    switch (messageType) {
      case "welcome_message":
        response = await generateWelcomeMessage(from);
        break;

      case "service_request":
        response = await handleServiceRequest(text, from);
        break;

      case "information":
        response = await handleInformationRequest(text);
        break;

      case "appointment_confirmation":
        response = await handleAppointmentConfirmation(text, from);
        break;

      case "cancellation_request":
        response = await handleCancellation(text, from);
        break;

      case "complaint_feedback":
        response = await handleComplaintFeedback(text, from);
        break;

      case "unknown":
      default:
        response = await handleUnknownMessage(text);
        break;
    }

    await sock.sendMessage(from, { text: response });

    console.log(`[BOT] ${from} | ${messageType} | ${text.substring(0, 50)}...`);
  } catch (error) {
    console.error("Erro no bot:", error);

    await sock.sendMessage(from, {
      text: errorHandlerMessage(),
    });
  }
}
