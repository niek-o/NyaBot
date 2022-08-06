import { globalLogger } from "@infinite-fansub/logger";
import { TextChannel } from "discord.js";
import { Player, Track } from "erela.js";
import { client } from "../nya";

export = {
	name: "trackStart",
	async execute(player: Player, track: Track) {
		const channel = client.channels.cache.find((channel) => channel.id === player.textChannel);

		if (channel instanceof TextChannel) {
			await channel.send(`NOW PLAYING: ${track.title}`);
		}
		globalLogger.defaultPrint(`${client.guilds.cache.get(player.guild)?.name}: Playing ${track.title}`);
	},
};
