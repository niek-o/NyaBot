import { NyaClient } from "../nya";
import { asciify } from "../utils/asciifier";
import { logger } from "../utils/logger";

export = {
	name: "ready",
	once: true,
	async execute(client: NyaClient) {
		if (!client.user) return;
		await asciify(client.user.avatarURL({ format: "jpg", dynamic: true, size: 1024 })!, true)
			.then((ascii) => console.log(ascii))
			.catch((err) => console.log(err));

		client.user.setActivity("Nekopara", { type: "WATCHING" });

		client.manager.init(client.user.id);

		logger.log(`Nya! :3`);
		logger.log(`Logged in as ${client.user.tag}`);
		logger.log(`Currently serving ${client.guilds.cache.size} servers`);
		logger.log();
	}
};