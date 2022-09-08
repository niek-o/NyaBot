import { Event } from "@infinite-fansub/discord-client";
import { ErelaEvents } from "@infinite-fansub/erela-module";
import { TextChannel } from "discord.js";
import nyaOptions from "../../config";
import { client } from "../../nya";
import { getBaseEmbed, timeout } from "../../utils/logic";

export default <Event<"queueEnd", ErelaEvents>>{
	event: "queueEnd",
	type: "on",
	async run(player) {
		const channel = client.channels.cache.find((channel) => channel.id === player.textChannel);

		if (channel instanceof TextChannel) {
			await channel.send({ embeds: [getBaseEmbed(channel, "Queue ended", "The queue has ended.")] });
		}

		logger.log(`${client.guilds.cache.get(player.guild)?.name}: Queue has ended`);

		await timeout(nyaOptions.music.options.timeOut);

		if (nyaOptions.music.options.leaveOnQueueEnd && !player.playing) {
			player.destroy();
		}
	},
};
