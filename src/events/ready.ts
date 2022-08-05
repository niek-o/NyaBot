import { Event } from "@infinite-fansub/discord-client/dist";
import { ActivityType } from "discord.js";
import { NyaClient } from "../nya";
import { asciify } from "../utils/asciifier";
import { logger } from "../utils/logger";

export default <Event<"ready">>{
	event: "ready",
	type: "once",
	async run(client: NyaClient) {
		if (!client.user) return;
		await asciify(client.user.avatarURL({ extension: "jpg", size: 1024 })!, true)
			.then((ascii) => console.log(ascii))
			.catch((err) => console.log(err));

		client.user.setActivity({ name: "Nekopara", type: ActivityType.Watching });

		client.manager.init(client.user.id);

		logger.log(`Nya! :3`);
		logger.log(`Logged in as ${client.user.tag}`);
		logger.log(`Currently serving ${client.guilds.cache.size} servers`);
		logger.log();
	},
};
