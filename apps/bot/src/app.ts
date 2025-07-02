import fastify from "fastify";

const app = fastify();

export async function startApp() {
	try {
		await app.listen({ port: 3333 });
		console.log("Server running at http://localhost:3333");
	} catch (err) {
		console.error("Error starting server:", err);
		process.exit(1);
	}
}
