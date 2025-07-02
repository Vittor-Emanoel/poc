import type { Boom } from "@hapi/boom";
import type { proto, WASocket } from "baileys";
import { DisconnectReason } from "baileys";
import fs from "node:fs";
import path from "node:path";
import Pino from "pino";
import QRCode from "qrcode";

const AUTH_DIR = path.resolve("auth_info");

export class BaileysEvents {
	private sock: WASocket;
	private logger = Pino({ level: "info" });
	private reconnectFn: () => void;

	constructor(sock: WASocket, reconnectFn: () => void) {
		this.sock = sock;
		this.reconnectFn = reconnectFn;
		this.registerListeners();
	}

	private registerListeners() {
		this.sock.ev.on("connection.update", this.onConnectionUpdate.bind(this));
		this.sock.ev.on("messages.upsert", this.onMessageUpsert.bind(this));
	}

	private async onConnectionUpdate({
		connection,
		lastDisconnect,
		qr,
	}: {
		connection: string;
		lastDisconnect?: { error: Boom };
		qr?: string;
	}) {
		if (qr) {
			console.log(await QRCode.toString(qr, { type: "terminal", small: true }));
		}

		if (connection === "close") {
			const reason = lastDisconnect?.error?.output?.statusCode ?? 0;
			const shouldReconnect = reason !== DisconnectReason.loggedOut;

			if (shouldReconnect) {
				this.logger.warn("Tentando reconectar...");
				setTimeout(this.reconnectFn, 5000);
			} else {
				this.logger.error("Sessão encerrada. Limpando login.");
				fs.rmSync(AUTH_DIR, { recursive: true, force: true });
			}
		}

		if (connection === "open") {
			this.logger.info("✅ Conectado ao WhatsApp.");
		}
	}

	private async onMessageUpsert({
		messages,
		type,
	}: {
		messages: proto.IWebMessageInfo[];
		type: string;
	}) {
		if (type !== "notify") return;

		for (const msg of messages) {
			if (!msg.message || msg.key.fromMe) continue;

			const from = msg.key.remoteJid!;
			const text =
				msg.message?.conversation ?? msg.message?.extendedTextMessage?.text;

			if (!text) return;

			this.logger.info(`📩 ${from}: ${text}`);

			try {
				if (text.startsWith("!ping")) {
					await this.sock.sendMessage(from, { text: "pong 🏓" });
				}
			} catch (err) {
				this.logger.error("❌ Erro ao enviar mensagem:", err);
			}
		}
	}
}
