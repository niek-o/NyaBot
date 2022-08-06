import { Event } from "@infinite-fansub/discord-client";
import { globalLogger } from "@infinite-fansub/logger";
import { ActivityType } from "discord.js";
import { NyaClient } from "../nya";
import { asciify } from "../utils/asciifier";

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

		globalLogger.defaultPrint(`Nya! :3`);
		globalLogger.defaultPrint(`Logged in as ${client.user.tag}`);
		globalLogger.defaultPrint(`Currently serving ${client.guilds.cache.size} servers\n`);
	},
};
