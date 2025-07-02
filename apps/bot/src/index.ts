import { startApp } from "./app";
import { initWhatsApp } from "./lib/whatsapp/baileys";

async function bootstrap() {
	await initWhatsApp();
	await startApp();
}

bootstrap();
