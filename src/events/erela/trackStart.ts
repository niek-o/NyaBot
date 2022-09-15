import { Event } from "@infinite-fansub/discord-client";
import { ErelaEvents } from "@infinite-fansub/erela-module";
import { TextChannel } from "discord.js";
import { client } from "../../nya";
import { getBaseEmbed, getThumbnail } from "../../utils/logic";

export default <Event<"trackStart", ErelaEvents>>{
	event: "trackStart",
	type: "on",
	async run(player, track) {
		const channel = client.channels.cache.find((channel) => channel.id === player.textChannel);

		if (channel instanceof TextChannel) {
			await channel.send({
				embeds: [
					getBaseEmbed(channel, "Now playing", `${track.author} - ${track.title}`)
						.setImage(await getThumbnail(track))
				]
			});
		}
		logger.log(`${client.guilds.cache.get(player.guild)?.name}: Playing ${track.title}`);
	},
};
