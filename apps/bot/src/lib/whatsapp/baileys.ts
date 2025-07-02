import {
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  default as makeWASocket,
  useMultiFileAuthState,
  type WASocket,
} from "baileys";
import fs from "node:fs";
import path from "node:path";
import Pino from "pino";
import { BaileysEvents } from "./baileys-events";

const AUTH_DIR = path.resolve("auth_info");
if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

let sock: WASocket;

export const getSock = () => sock;

export async function initWhatsApp(): Promise<WASocket> {
	const logger = Pino({ level: "info" });
	const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
	const { version } = await fetchLatestBaileysVersion();

	sock = makeWASocket({
		version,
		logger,
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys),
		},
		browser: ["POC", "Chrome", "123.0.0"],
	});

	sock.ev.on("creds.update", saveCreds);

	new BaileysEvents(sock, () => initWhatsApp());

	return sock;
}
