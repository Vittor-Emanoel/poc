import type { proto, WASocket } from "baileys";

// toda logica inicial do bot
export async function startBot(sock: WASocket, msg: proto.IWebMessageInfo) {
	const from = msg.key.remoteJid!;
	const body =
		msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

	if (!body.startsWith("!")) return;

	const [command, ...args] = body.trim().split(/\s+/);
}
